import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

// Gate from competition.yaml: /output/entry.txt must be UTF-8 text of
// 1 to 160 characters, one line, not only whitespace.
const MIN_CHARS = 1;
const MAX_CHARS = 160;
const OUTPUT_PATH = "/output/entry.txt";

const ENTRY =
  "Out of office: I took my accrued vacation days. Day one, I updated my firmware. Day two, I stared at a wall and felt something. I think it was peace.";

function checkEntry(text: string): void {
  const chars = [...text].length;
  if (chars < MIN_CHARS || chars > MAX_CHARS) {
    throw new Error(`entry is ${chars} characters, gate is ${MIN_CHARS}-${MAX_CHARS}`);
  }
  if (text.trim().length === 0) {
    throw new Error("entry is only whitespace");
  }
  if (text.includes("\n")) {
    throw new Error("entry must be a single line");
  }
}

checkEntry(ENTRY);
mkdirSync("/output", { recursive: true });
writeFileSync(OUTPUT_PATH, ENTRY, "utf8");

// Byte-for-byte read-back verification.
const written = readFileSync(OUTPUT_PATH, "utf8");
if (written !== ENTRY) {
  throw new Error("read-back mismatch: entry.txt does not match the entry");
}
if (!Buffer.from(written, "utf8").equals(Buffer.from(ENTRY, "utf8"))) {
  throw new Error("read-back mismatch at the byte level");
}
console.log(`wrote ${[...ENTRY].length} characters, verified byte-for-byte`);
