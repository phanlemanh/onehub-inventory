// JSON written the way a formatter leaves it, so a file this tool writes does not fail the
// repository's format check.
import { readFileSync } from "node:fs";
import path from "node:path";

// The line width the repository's formatter keeps, so the file is written the way it leaves it.
export function lineWidth(root) {
  const read = (file) => {
    try {
      return JSON.parse(readFileSync(path.join(root, file), "utf8"));
    } catch {
      return null;
    }
  };
  return (
    read(".prettierrc.json")?.printWidth ??
    read(".prettierrc")?.printWidth ??
    read("package.json")?.prettier?.printWidth ??
    80
  );
}

// JSON laid out as a formatter leaves it: objects open, a list of words on one line when it fits.
export function renderJson(data, width = 80) {
  const lines = (value, indent, lead, tail) => {
    const pad = " ".repeat(indent);
    if (Array.isArray(value) && value.every((item) => typeof item !== "object")) {
      const flat = `${pad}${lead}[${value.map((item) => JSON.stringify(item)).join(", ")}]${tail}`;
      if (flat.length <= width) return [flat];
    }
    if (typeof value !== "object" || value === null) {
      return [`${pad}${lead}${JSON.stringify(value)}${tail}`];
    }
    const list = Array.isArray(value);
    const items = list ? value.map((item) => ["", item]) : Object.entries(value);
    if (items.length === 0) return [`${pad}${lead}${list ? "[]" : "{}"}${tail}`];
    return [
      `${pad}${lead}${list ? "[" : "{"}`,
      ...items.flatMap(([key, item], index) =>
        lines(
          item,
          indent + 2,
          list ? "" : `${JSON.stringify(key)}: `,
          index < items.length - 1 ? "," : "",
        ),
      ),
      `${pad}${list ? "]" : "}"}${tail}`,
    ];
  };
  return `${lines(data, 0, "", "").join("\n")}\n`;
}
