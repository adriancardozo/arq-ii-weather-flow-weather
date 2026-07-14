import { ConsoleLogger, Injectable, LoggerService, LogLevel } from '@nestjs/common';
import { logs, SeverityNumber } from '@opentelemetry/api-logs';
import configuration from '../configuration/configuration';

export type JsonLog = (Record<string, any> & { message?: string }) | string;

const { app } = configuration();

@Injectable()
export class OpenTelemetryLoggerService extends ConsoleLogger implements LoggerService {
  log(log?: JsonLog, ...optionalParams: Array<any>) {
    this.wrap((message, ...params) => super.log(message, ...params), 'INFO', log, ...optionalParams);
  }

  error(log?: JsonLog, ...optionalParams: Array<any>) {
    this.wrap((message, ...params) => super.error(message, ...params), 'ERROR', log, ...optionalParams);
  }

  warn(log?: JsonLog, ...optionalParams: Array<any>) {
    this.wrap((message, ...params) => super.warn(message, ...params), 'WARN', log, ...optionalParams);
  }

  debug(log?: JsonLog, ...optionalParams: Array<any>) {
    this.wrap((message, ...params) => super.debug(message, ...params), 'DEBUG', log, ...optionalParams);
  }

  verbose(log?: JsonLog, ...optionalParams: Array<any>) {
    this.wrap((message, ...params) => super.verbose(message, ...params), 'INFO', log, ...optionalParams);
  }

  fatal(log?: JsonLog, ...optionalParams: Array<any>) {
    this.wrap((message, ...params) => super.fatal(message, ...params), 'FATAL', log, ...optionalParams);
  }

  setLogLevels(levels: Array<LogLevel>) {
    super.setLogLevels(levels);
  }

  private wrap(
    callback: (log?: JsonLog, ...optionalParams: Array<any>) => void,
    severity: keyof typeof SeverityNumber,
    log?: JsonLog,
    ...optionalParams: Array<any>
  ) {
    const logger = logs.getLogger(optionalParams[0] ?? this.context ?? `default_${app.service_name}`);
    const message = typeof log === 'string' ? log : log?.message;
    callback(message, ...optionalParams);
    logger.emit({ body: log, severityText: severity, severityNumber: SeverityNumber[severity] });
  }
}
