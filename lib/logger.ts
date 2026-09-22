import "server-only";

type LogLevel = "debug" | "info" | "warn" | "error";

const COLORS = {
  debug: "\x1b[34m", // blue
  info: "\x1b[32m", // green
  warn: "\x1b[33m", // yellow
  error: "\x1b[31m", // red
  reset: "\x1b[0m"
};

function write(level: LogLevel, scope: string, message: string, meta?: Record<string, unknown>) {
  const metaStr = meta && Object.keys(meta).length > 0 ? ` ${JSON.stringify(meta)}` : '';
  const prefix = `${COLORS[level]}[${level.toUpperCase()}] [${scope}]${COLORS.reset}`;
  const line = `${prefix} ${message}${metaStr}`;
  
  if (level === "error") console.error(line);
  else if (level === "warn") console.warn(line);
  else console.log(line);
}

/**
 * Structured server-side logger. Never pass secrets/tokens/passwords in
 * `meta` — this logs to stdout/stderr as-is, with no redaction.
 */
export const logger = {
  debug: (scope: string, message: string, meta?: Record<string, unknown>) =>
    write("debug", scope, message, meta),
  info: (scope: string, message: string, meta?: Record<string, unknown>) =>
    write("info", scope, message, meta),
  warn: (scope: string, message: string, meta?: Record<string, unknown>) =>
    write("warn", scope, message, meta),
  error: (scope: string, message: string, meta?: Record<string, unknown>) =>
    write("error", scope, message, meta),
};

/**
 * One-line log for a Route Handler invocation: method + path, under a
 * `scope` naming the route (e.g. "api:scores"). Never logs the body —
 * add fields to `meta` explicitly (and never secrets/tokens) if needed.
 */
export function logApiRequest(request: Request, scope: string, meta?: Record<string, unknown>) {
  const { pathname } = new URL(request.url);
  logger.info(scope, `${request.method} ${pathname}`, meta);
}
