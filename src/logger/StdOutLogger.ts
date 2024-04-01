import { LogLevel } from '@nestjs/common';
import { LogWriter } from './logger.interface';

export const colors = {
  green: (text: string) => `\x1B[32m${text}\x1B[39m`,
  yellow: (text: string) => `\x1B[33m${text}\x1B[39m`,
  red: (text: string) => `\x1B[31m${text}\x1B[39m`,
  magenta: (text: string) => `\x1B[95m${text}\x1B[39m`,
};
export class StdOutLogger implements LogWriter {
  async write(message: string, level: LogLevel): Promise<void> {
    switch (level) {
      case 'debug':
        process.stdout.write(colors.magenta(message));
        break;
      case 'error':
        process.stdout.write(colors.red(message));
        break;
      case 'warn':
        process.stdout.write(colors.yellow(message));
        break;
      default:
        process.stdout.write(colors.green(message));
    }
  }
}
