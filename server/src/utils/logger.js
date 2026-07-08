import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LOG_DIR = path.join(__dirname, "../../logs");

if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}

function getLogStream(type) {
  const date = new Date().toISOString().split("T")[0];
  return path.join(LOG_DIR, `${type}-${date}.log`);
}

function append(type, ...args) {
  const timestamp = new Date().toISOString();
  const message = args
    .map((a) => (typeof a === "object" ? JSON.stringify(a, null, 2) : String(a)))
    .join(" ");
  const line = `[${timestamp}] ${message}\n`;
  const file = getLogStream(type);
  fs.appendFile(file, line, (err) => {
    if (err) process.stderr.write(`Logger error: ${err.message}\n`);
  });
}

export default {
  error: (...args) => {
    append("error", ...args);
    process.stderr.write(args.map((a) => String(a)).join(" ") + "\n");
  },
  warn: (...args) => {
    append("warn", ...args);
    process.stdout.write(args.map((a) => String(a)).join(" ") + "\n");
  },
  info: (...args) => {
    append("info", ...args);
    process.stdout.write(args.map((a) => String(a)).join(" ") + "\n");
  },
};
