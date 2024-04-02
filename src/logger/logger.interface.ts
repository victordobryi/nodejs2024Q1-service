import { LogLevel as NestLogLevel } from '@nestjs/common';

export enum LogLevel {
  LOG = 0,
  ERROR = 1,
  WARN = 2,
  DEBUG = 3,
  VERBOSE = 4,
  FATAL = 5,
}
export enum LogName {
  LOG = 'log',
  ERROR = 'error',
  WARN = 'warn',
  DEBUG = 'debug',
  VERBOSE = 'verbose',
  FATAL = 'fatal',
}

export type LogTarget = 'file' | 'stdout';

export type LogWriter = {
  write: (message: string, level: NestLogLevel) => Promise<void>;
};
