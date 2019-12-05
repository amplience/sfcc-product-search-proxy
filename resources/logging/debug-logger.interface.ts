export interface DebugLogger {
  debug(message: string, ...context: any[]);

  info(message: string, ...context: any[]);

  warn(message: string, ...context: any[]);

  error(message: string, ...context: any[]);
}
