const levels = { debug: 0, info: 1, warn: 2, error: 3 } as const;
type Level = keyof typeof levels;
const current: Level = process.env.NODE_ENV === "production" ? "info" : "debug";

function log(level: Level, msg: string, ...args: unknown[]) {
  if (levels[level] < levels[current]) return;
  const ts = new Date().toISOString();
  const prefix = `[${ts}] [${level.toUpperCase()}]`;
  const out = level === "error" ? console.error : level === "warn" ? console.warn : console.log;
  out(prefix, msg, ...args);
}

export const logger = {
  debug: (m: string, ...a: unknown[]) => log("debug", m, ...a),
  info: (m: string, ...a: unknown[]) => log("info", m, ...a),
  warn: (m: string, ...a: unknown[]) => log("warn", m, ...a),
  error: (m: string, ...a: unknown[]) => log("error", m, ...a),
};
