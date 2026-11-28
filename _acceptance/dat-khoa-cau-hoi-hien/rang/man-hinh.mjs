// What a terminal shows after a stream of bytes: a small screen model that applies the moves and erases readline and
// make send (carriage return, line feed, backspace, CSI cursor moves, erase in line, erase in display). Enough to say
// which lines are still on the screen when the command ends; not a full terminal. Strict: an escape sequence it does
// not model throws (`màn dựng lại gặp chuỗi điều khiển lạ`), so a sequence it would get wrong can never pass silently.
export function screenOf(text, cols = 200, resizes = []) {
  // resizes: [{at: <character index>, cols}] — the width changes there, without reflow of what is already drawn.
  const pending = [...resizes].sort((a, b) => a.at - b.at);
  const strange = (seq) => {
    throw new Error(`màn dựng lại gặp chuỗi điều khiển lạ: ${JSON.stringify(seq)}`);
  };
  const lines = [[]];
  const wrapped = new Set(); // rows that continue the row above because text ran past the width (soft wrap)
  let row = 0;
  let col = 0;
  const line = () => {
    while (lines.length <= row) lines.push([]);
    return lines[row];
  };
  const put = (ch) => {
    if (col >= cols) {
      row += 1;
      col = 0;
      line().length = 0;
      wrapped.add(row);
    }
    const l = line();
    while (l.length < col) l.push(" ");
    l[col] = ch;
    col += 1;
  };
  const chars = Array.from(text);
  for (let i = 0; i < chars.length; i++) {
    while (pending.length && pending[0].at <= i) cols = pending.shift().cols;
    const c = chars[i];
    if (c === "\r") col = 0;
    else if (c === "\n") {
      row += 1;
      wrapped.delete(row);
      line();
    } else if (c === "\b") col = Math.max(0, col - 1);
    else if (c === "\x07") continue;
    else if (c === "\t") col = Math.min(cols - 1, (Math.floor(col / 8) + 1) * 8);
    else if (c === "\x1b") {
      if (chars[i + 1] === "[") {
        let j = i + 2;
        let params = "";
        while (j < chars.length && /[0-9;?]/.test(chars[j])) params += chars[j++];
        const fin = chars[j];
        const n = params.startsWith("?") ? 0 : Number.parseInt(params || "0", 10);
        const n1 = Number.isNaN(n) || n === 0 ? 1 : n;
        if (fin === "G") col = n1 - 1;
        else if (fin === "C") col += n1;
        else if (fin === "D") col = Math.max(0, col - n1);
        else if (fin === "A") row = Math.max(0, row - n1);
        else if (fin === "B") row += n1;
        else if (fin === "K") {
          const l = line();
          if (n === 0) l.length = Math.min(l.length, col);
          else if (n === 1) for (let k = 0; k <= col && k < l.length; k++) l[k] = " ";
          else l.length = 0;
        } else if (fin === "J") {
          if (n === 0) {
            line().length = Math.min(line().length, col);
            lines.length = row + 1;
          } else if (n === 2 || n === 3) {
            for (const l of lines) l.length = 0;
          } else strange(`\x1b[${params}${fin}`);
        } else strange(`\x1b[${params}${fin ?? ""}`);
        if (fin === "K" && n > 2) strange(`\x1b[${params}${fin}`);
        if (params.startsWith("?")) strange(`\x1b[${params}${fin}`);
        i = j;
      } else strange(`\x1b${chars[i + 1] ?? ""}`);
    } else if (c >= " ") put(c);
    else strange(c);
  }
  // Logical lines: a soft-wrapped row joins the row above, as a terminal shows one long line over several rows.
  const out = [];
  lines.forEach((l, r) => {
    const text = l.join("");
    if (wrapped.has(r) && out.length) out[out.length - 1] += text;
    else out.push(text);
  });
  return out.map((l) => l.trimEnd());
}
