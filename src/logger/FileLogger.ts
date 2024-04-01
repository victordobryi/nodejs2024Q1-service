import { resolve } from 'path';
import { PathLike, WriteStream, createWriteStream } from 'fs';
import { LogName, LogWriter } from './logger.interface';
import { LogLevel as NestLogLevel } from '@nestjs/common';
import { copyFile, truncate, mkdir } from 'fs/promises';

type FileLoggerConfig = {
  limit: number;
  logsFolder: string;
  errorLogsFileName: string;
  combinedLogsFileName: string;
};

type FileInfo = {
  stream?: WriteStream;
  filePath: string;
};

export class FileLogger implements LogWriter {
  private config: FileLoggerConfig;
  private files: Record<NestLogLevel, FileInfo>;
  private streams: Map<PathLike, WriteStream> = new Map();
  private bytesWritten: Map<WriteStream, number> = new Map();

  constructor() {
    this.config = this.readConfig();
    this.files = this.createFileInfos();
    this.createLogsFolder();
  }

  private readConfig(): FileLoggerConfig {
    return {
      limit: +process.env.FILE_MAX_SIZE || 307200,
      logsFolder: process.env.LOG_DIR || 'logsHistory',
      errorLogsFileName: process.env.LOG_ERROR_FILE || 'error.log',
      combinedLogsFileName: process.env.LOG_COMBINED_FILE ?? 'combined.log',
    };
  }

  private async createLogsFolder(): Promise<void> {
    const logsFolderPath = resolve(this.config.logsFolder);
    await mkdir(logsFolderPath, { recursive: true });
  }

  private createFileInfos(): Record<LogName, FileInfo> {
    const combinedLogsFileInfo: FileInfo = {
      filePath: resolve(
        this.config.logsFolder,
        this.config.combinedLogsFileName,
      ),
    };
    const errorLogsFileInfo: FileInfo = {
      filePath: resolve(this.config.logsFolder, this.config.errorLogsFileName),
    };

    return {
      debug: combinedLogsFileInfo,
      error: errorLogsFileInfo,
      fatal: combinedLogsFileInfo,
      log: combinedLogsFileInfo,
      verbose: combinedLogsFileInfo,
      warn: combinedLogsFileInfo,
    };
  }

  private getOrCreateStream(level: NestLogLevel): WriteStream {
    const fileInfo = this.files[level];
    if (!fileInfo.stream) {
      fileInfo.stream = this.createStream(fileInfo.filePath);
    }
    return fileInfo.stream;
  }

  private createStream(filePath: PathLike): WriteStream {
    if (!this.streams.has(filePath)) {
      const stream = createWriteStream(filePath, { flags: 'a' });
      this.streams.set(filePath, stream);
      this.bytesWritten.set(stream, 0);
    }
    return this.streams.get(filePath)!;
  }

  async write(message: string, level: NestLogLevel): Promise<void> {
    const stream: WriteStream = this.getOrCreateStream(level);
    await this.write_internal(stream, message, level);
  }

  private async write_internal(
    stream: WriteStream,
    message: string,
    level: NestLogLevel,
  ): Promise<void> {
    const isWritten = stream.write(message, async () => {
      const isRotateLogfile = this.checkIfToRotateLogFile(stream);
      if (isRotateLogfile) {
        await this.rotateLogFile(level);
      }
    });
    if (!isWritten) {
      return new Promise((resolve) => {
        stream.once('drain', resolve);
      }).then(() => {
        this.write_internal(stream, message, level);
      });
    }
  }

  private checkIfToRotateLogFile(stream: WriteStream): boolean {
    const bytesWritten = this.bytesWritten.get(stream)!;
    return stream.bytesWritten - bytesWritten >= this.config.limit;
  }

  private async rotateLogFile(level: NestLogLevel): Promise<void> {
    const fileInfo = this.files[level];
    const copyPath = `${fileInfo.filePath.slice(
      0,
      -4,
    )}_${this.getFormattedDate()}.log`;
    await copyFile(fileInfo.filePath, copyPath);
    await truncate(fileInfo.filePath, 0);

    const stream = fileInfo.stream!;
    this.bytesWritten.set(stream, stream.bytesWritten);
  }

  private getFormattedDate(): string {
    const now = new Date();
    return `${now.getFullYear()}.${now.getMonth()}.${now.getDay()}T${now.getHours()}.${now.getMinutes()}.${now.getMilliseconds()}`;
  }
}
