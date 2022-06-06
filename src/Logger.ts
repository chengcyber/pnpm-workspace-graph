const LEVELS = ["debug", "info", "warn", "error", "silent"] as const;

type Level = typeof LEVELS[number];

const LEVEL_TO_CONSOLE_METHOD = new Map<Level, "log">([
  ["debug", "log"],
  ["info", "log"],
  ["warn", "log"],
]);

class Logger {
  static levels = LEVELS;
  static defaultLevel: Level = "info";

  activeLevels = new Set();

  constructor(level?: Level) {
    if (level) {
      this.setLogLevel(level);
      return;
    }

    const envLevel = process.env.PWG_LOG_LEVEL;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (envLevel && LEVELS.includes(envLevel as any)) {
      this.setLogLevel(envLevel as Level);
      return;
    }

    this.setLogLevel(Logger.defaultLevel);
  }

  setLogLevel(level: Level) {
    const levelIndex = LEVELS.indexOf(level);

    if (levelIndex === -1)
      throw new Error(
        `Invalid log level "${level}". Use one of these: ${LEVELS.join(", ")}`
      );

    this.activeLevels.clear();

    for (const [i, level] of LEVELS.entries()) {
      if (i >= levelIndex) this.activeLevels.add(level);
    }
  }

  _log(level: Level, ...args: unknown[]) {
    if (!this.activeLevels.has(level)) {
      return;
    }
    console[(LEVEL_TO_CONSOLE_METHOD.get(level) || level) as "log"](...args);
  }

  info(...args: unknown[]) {
    this._log("info", ...args);
  }

  debug(...args: unknown[]) {
    this._log("debug", ...args);
  }

  warn(...args: unknown[]) {
    this._log("warn", ...args);
  }

  error(...args: unknown[]) {
    this._log("error", ...args);
  }

  // eslint-disable-next-line
  silent(...args: unknown[]) {}
}

export default Logger;
