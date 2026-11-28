"""Runs one command on a real pseudo-terminal of the operating system and answers its questions like a person pasting.

python3 -I pty.py <plan.json> <raw-output-path>
plan.json: {"cmd": [...], "cwd": "...", "env": {...}, "answers": [{"after": "<text of the question>", "send": "<answer>"}]}
Each answer is sent once the question has appeared in the output since the previous answer ("after": "" = at once),
followed by a carriage return as the Enter key sends it, unless "enter": false. An answer with "resize": [rows, cols]
changes the terminal size right after it is sent, as a person dragging the window (the command gets SIGWINCH). The
terminal starts at plan "cols" columns (default 200). Writes every byte the terminal showed to <raw-output-path> and
prints one JSON line {"exit": <code>, "answered": <n>, "timeout": <bool>, "resizes": [{"at": <byte offset>, "cols": <n>}]}.
"""
import fcntl, json, os, select, struct, subprocess, sys, termios, time

plan = json.load(open(sys.argv[1], encoding="utf-8"))
raw_path = sys.argv[2]
master, slave = os.openpty()
fcntl.ioctl(slave, termios.TIOCSWINSZ, struct.pack("HHHH", 50, int(plan.get("cols", 200)), 0, 0))
proc = subprocess.Popen(plan["cmd"], cwd=plan["cwd"], env=plan["env"], stdin=slave, stdout=slave, stderr=slave,
                        start_new_session=True, close_fds=True)
os.close(slave)
raw = b""
seen_from = 0
answers = list(plan["answers"])
answered = 0
deadline = time.time() + float(plan.get("timeout", 60))
timeout = False
resizes = []
while True:
    if time.time() > deadline:
        timeout = True
        proc.kill()
        break
    r, _, _ = select.select([master], [], [], 0.1)
    if r:
        try:
            chunk = os.read(master, 65536)
        except OSError:
            chunk = b""
        if not chunk:
            if proc.poll() is not None:
                break
            continue
        raw += chunk
    elif proc.poll() is not None:
        break
    if answers:
        text = raw[seen_from:].decode("utf-8", "replace")
        if answers[0]["after"] in text:
            time.sleep(0.3)  # let readline finish drawing, as a person reads before pasting
            while True:
                r, _, _ = select.select([master], [], [], 0.05)
                if not r:
                    break
                more = os.read(master, 65536)
                if not more:
                    break
                raw += more
            seen_from = len(raw)
            a = answers.pop(0)
            os.write(master, a["send"].encode("utf-8") + (b"\r" if a.get("enter", True) else b""))
            answered += 1
            if a.get("resize"):
                time.sleep(0.3)
                while True:  # bytes drawn before the resize belong to the old width
                    r, _, _ = select.select([master], [], [], 0.05)
                    if not r:
                        break
                    more = os.read(master, 65536)
                    if not more:
                        break
                    raw += more
                rows, cols = a["resize"]
                resizes.append({"at": len(raw), "cols": cols})
                fcntl.ioctl(master, termios.TIOCSWINSZ, struct.pack("HHHH", rows, cols, 0, 0))
                seen_from = len(raw)
code = proc.wait()
os.close(master)
open(raw_path, "wb").write(raw)
print(json.dumps({"exit": code, "answered": answered, "timeout": timeout, "resizes": resizes}))
