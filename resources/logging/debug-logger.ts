import { DebugLogger } from './debug-logger.interface';
import { debug } from 'debug';

interface SupportLevels {
  debug: debug.IDebugger;
  info: debug.IDebugger;
  warn: debug.IDebugger;
  error: debug.IDebugger;
}

class DebugLoggerImpl implements DebugLogger {
  private loggers: SupportLevels;
  private additionalContextFn?: () => {};

  constructor(namespace: string, additionalContext?: () => {}) {
    this.setupLogs(namespace);
    this.additionalContextFn = additionalContext;
  }

  public debug(message: string, ...context: any[]) {
    this.logWrapper('debug', message, context);
  }

  public error(message: string, ...context: any[]) {
    this.logWrapper('error', message, context);
  }

  public info(message: string, ...context: any[]) {
    this.logWrapper('info', message, context);
  }

  public warn(message: string, ...context: any[]) {
    this.logWrapper('warn', message, context);
  }

  private setupLogs(namespace: string) {

    this.loggers = {
      debug: debug(`${ namespace }:debug`),
      info: debug(`${ namespace }:info`),
      warn: debug(`${ namespace }:warn`),
      error: debug(`${ namespace }:error`)
    };

    Object.keys(this.loggers).forEach(key => {
      const item = this.loggers[ key ];
      item.log = console.log.bind(console);
    });
  }

  private logWrapper(level: keyof SupportLevels, message: string, context: any[]) {
    if (this.additionalContextFn) {
      const loggingContext = this.additionalContextFn();
      if (loggingContext) {
        context.push(loggingContext);
      }
    }
    this.loggers[ level ].apply(null, [ message ].concat(context));
  }
}

const logger = new DebugLoggerImpl(process.env.APP_NAME || 'sfcc-product-search-proxy');

export function getLogger(): DebugLogger {
  return logger;
}
