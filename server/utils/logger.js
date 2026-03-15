const env = require("../config/env");

const colors = {
  reset: "\x1b[0m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  white: "\x1b[37m",
};

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

const levelColors = {
  error: colors.red,
  warn: colors.yellow,
  info: colors.green,
  http: colors.magenta,
  debug: colors.cyan,
};

const currentLevel = levels[env.LOG_LEVEL] || levels.info;

const formatMessage = (level, message, meta = {}) => {
  const timestamp = new Date().toISOString();
  const color = levelColors[level] || colors.white;
  const metaStr = Object.keys(meta).length > 0 ? JSON.stringify(meta) : "";

  return `${color}[${timestamp}] [${level.toUpperCase()}]${colors.reset} ${message} ${metaStr}`;
};

const logger = {
  error: (message, meta = {}) => {
    if (currentLevel >= levels.error) {
      console.error(formatMessage("error", message, meta));
    }
  },

  warn: (message, meta = {}) => {
    if (currentLevel >= levels.warn) {
      console.warn(formatMessage("warn", message, meta));
    }
  },

  info: (message, meta = {}) => {
    if (currentLevel >= levels.info) {
      console.info(formatMessage("info", message, meta));
    }
  },

  http: (message, meta = {}) => {
    if (currentLevel >= levels.http) {
      console.log(formatMessage("http", message, meta));
    }
  },

  debug: (message, meta = {}) => {
    if (currentLevel >= levels.debug) {
      console.log(formatMessage("debug", message, meta));
    }
  },
};

module.exports = logger;
