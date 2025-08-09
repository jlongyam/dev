// core/services/LoggerService.js
class LoggerService {
  constructor(options = {}) {
    this.logLevel = options.logLevel || 'info';
    this.levels = {
      error: 0,
      warn: 1,
      info: 2,
      debug: 3
    };
  }

  log(level, message, metadata = {}) {
    if (this.levels[level] <= this.levels[this.logLevel]) {
      const timestamp = new Date().toISOString();
      const logEntry = { timestamp, level, message, ...metadata };
      
      // Platform-specific output (console, file, remote server, etc.)
      this._output(logEntry);
    }
  }

  error(message, metadata) {
    this.log('error', message, metadata);
  }

  warn(message, metadata) {
    this.log('warn', message, metadata);
  }

  info(message, metadata) {
    this.log('info', message, metadata);
  }

  debug(message, metadata) {
    this.log('debug', message, metadata);
  }

  _output(logEntry) {
    // Default to console, can be overridden by platform adapters
    const { level, message, ...rest } = logEntry;
    const logMethod = console[level] || console.log;
    logMethod(`[${logEntry.level.toUpperCase()}] ${logEntry.message}`, rest);
  }
}

export default LoggerService;