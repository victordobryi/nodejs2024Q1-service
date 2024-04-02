import {
  Injectable,
  LoggerService as NestLogger,
  LogLevel as NestLogLevel,
} from '@nestjs/common';

import { FileLogger } from './FileLogger';
import { StdOutLogger } from './StdOutLogger';
import { EOL } from 'os';
import { LogLevel, LogName, LogTarget, LogWriter } from './logger.interface';

@Injectable()
export class LoggerService implements NestLogger {
  private highestLogLevelValue: LogLevel =
    +process.env.LOG_LEVEL || LogLevel.FATAL;
  private loggers: LogWriter[];

  constructor() {
    this.setTargets(['file', 'stdout']);
  }

  private formatMessage = (
    context: string,
    message: string,
    level: NestLogLevel,
  ): string => {
    const now = new Date();
    const time = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}(${now.getMilliseconds()})`;
    return `${time} - [${context}] - [${level.toUpperCase()}] - ${message}${EOL}`;
  };

  private writeLog(
    context: string,
    message: string,
    level: NestLogLevel,
  ): void {
    if (!this.isLevelEnabled(LogLevel[level])) {
      return;
    }
    this.loggers.forEach((l) =>
      l.write(this.formatMessage(context, message, level), level),
    );
  }

  log(message: any, ...optionalParams: any[]) {
    if (!this.isLevelEnabled(LogLevel.LOG)) {
      return;
    }
    this.writeLog(optionalParams.join(','), message, LogName.LOG);
  }
  error(message: any, ...optionalParams: any[]) {
    if (!this.isLevelEnabled(LogLevel.ERROR)) {
      return;
    }
    this.writeLog(optionalParams.join(','), message, LogName.ERROR);
  }
  warn(message: any, ...optionalParams: any[]) {
    if (!this.isLevelEnabled(LogLevel.WARN)) {
      return;
    }
    this.writeLog(optionalParams.join(','), message, LogName.WARN);
  }
  debug(message: any, ...optionalParams: any[]) {
    if (!this.isLevelEnabled(LogLevel.DEBUG)) {
      return;
    }
    this.writeLog(optionalParams.join(','), message, LogName.DEBUG);
  }
  verbose(message: any, ...optionalParams: any[]) {
    if (!this.isLevelEnabled(LogLevel.VERBOSE)) {
      return;
    }
    this.writeLog(optionalParams.join(','), message, LogName.VERBOSE);
  }

  setTargets(targets: LogTarget[]): void {
    this.loggers = targets.map((t) => {
      switch (t) {
        case 'file':
          return new FileLogger();
        case 'stdout':
          return new StdOutLogger();
      }
    });
  }
  private isLevelEnabled(level: LogLevel): boolean {
    return level >= this.highestLogLevelValue;
  }
}
