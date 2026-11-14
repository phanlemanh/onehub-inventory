// The block style and the one-line style of YAML that the design ledgers and the pages of screen
// kinds use, read as data. Nothing here depends on a YAML library: a repository's tools and its
// tests read the same files with this one reader.

const scalar = (text) => {
  const value = text.trim();
  const quoted = /^(["'])(.*)\1$/.exec(value);
  return quoted ? quoted[2] : value.replace(/\s+#.*$/, "");
};

// Splits `a, "b, c", {d: e}` at the commas that are not inside quotes or brackets.
function splitFlow(text) {
  const parts = [];
  let depth = 0;
  let quote = null;
  let from = 0;
  for (let i = 0; i < text.length; i += 1) {
    const c = text[i];
    if (quote) quote = c === quote ? null : quote;
    else if (c === '"' || c === "'") quote = c;
    else if (c === "[" || c === "{") depth += 1;
    else if (c === "]" || c === "}") depth -= 1;
    else if (c === "," && depth === 0) {
      parts.push(text.slice(from, i));
      from = i + 1;
    }
  }
  parts.push(text.slice(from));
  return parts.map((part) => part.trim()).filter((part) => part !== "");
}

function flow(text) {
  const value = text.trim();
  if (value.startsWith("[") && value.endsWith("]")) return splitFlow(value.slice(1, -1)).map(flow);
  if (value.startsWith("{") && value.endsWith("}")) {
    return Object.fromEntries(
      splitFlow(value.slice(1, -1)).map((pair) => {
        const at = pair.indexOf(":");
        return [pair.slice(0, at).trim(), flow(pair.slice(at + 1))];
      }),
    );
  }
  return scalar(value);
}

// The lines of a block that sit deeper than `indent`, as a value: a list, a map or nothing.
function block(lines, indent) {
  const inner = [];
  // A list may sit at the indent of its own key.
  const inside = (line) =>
    line.trim() === "" ||
    line.search(/\S/) > indent ||
    (line.search(/\S/) === indent && /^\s*-(\s|$)/.test(line));
  while (lines.length > 0 && inside(lines[0])) inner.push(lines.shift());
  const own = inner.filter((line) => line.trim() !== "" && !line.trim().startsWith("#"));
  if (own.length === 0) return "";
  const depth = own[0].search(/\S/);
  if (own[0].trim().startsWith("- ") || own[0].trim() === "-") {
    const items = [];
    while (own.length > 0) {
      const first = own.shift();
      const rest = first.slice(depth + 1).replace(/^ /, "");
      const body = [];
      while (own.length > 0 && own[0].search(/\S/) > depth) body.push(own.shift());
      const field = /^([\w-]+):(\s|$)/.test(rest);
      // `- key: value` opens a map whose other keys follow, indented under it.
      if (field) items.push(map([" ".repeat(depth + 2) + rest, ...body]));
      else items.push(body.length > 0 ? block(body, depth) : flow(rest));
    }
    return items;
  }
  return map(own);
}

function map(lines) {
  const found = {};
  const rest = [...lines];
  while (rest.length > 0) {
    const line = rest.shift();
    if (line.trim() === "" || line.trim().startsWith("#")) continue;
    const field = /^(\s*)([\w-]+):\s*(.*)$/.exec(line);
    if (!field) continue;
    found[field[2]] = field[3].trim() === "" ? block(rest, field[1].length) : flow(field[3]);
  }
  return found;
}

// A YAML text as data. A scalar is kept as written; `null` and `~` are null.
export function readYaml(text) {
  const nulls = (value) => {
    if (Array.isArray(value)) return value.map(nulls);
    if (value && typeof value === "object") {
      return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, nulls(item)]));
    }
    return value === "null" || value === "~" ? null : value;
  };
  return nulls(map(String(text ?? "").split(/\r?\n/)));
}
