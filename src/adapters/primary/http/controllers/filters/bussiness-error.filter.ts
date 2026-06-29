import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { BaseExceptionFilter, HttpAdapterHost } from '@nestjs/core';
import { BussinessError } from 'src/bussiness/errors/bussiness.error';
import { CurrentTemperatureNotFoundError } from 'src/bussiness/errors/current-temperature-not-found.error';
import { LastDayAverageTemperatureNotFoundError } from 'src/bussiness/errors/last-day-average-temperature-not-found.error';
import { LastWeekAverageTemperatureNotFoundError } from 'src/bussiness/errors/last-week-average-temperature-not-found.error';
import { MeasurementNotFoundError } from 'src/bussiness/errors/measurement-not-found.error';
import { StationNotFoundError } from 'src/bussiness/errors/station-not-found.error';

@Catch(BussinessError)
export class BussinessExceptionFilter implements ExceptionFilter {
  private readonly logger: Logger = new Logger(BussinessExceptionFilter.name);
  private readonly baseFilter: BaseExceptionFilter;

  constructor(private readonly httpAdapterHost: HttpAdapterHost) {
    this.baseFilter = new BaseExceptionFilter(this.httpAdapterHost.httpAdapter);
  }

  catch(exception: BussinessError, host: ArgumentsHost) {
    try {
      if (exception instanceof MeasurementNotFoundError) throw new NotFoundException(exception.message);
      if (exception instanceof StationNotFoundError) throw new NotFoundException(exception.message);
      if (exception instanceof CurrentTemperatureNotFoundError)
        throw new NotFoundException(exception.message);
      if (exception instanceof LastDayAverageTemperatureNotFoundError)
        throw new NotFoundException(exception.message);
      if (exception instanceof LastWeekAverageTemperatureNotFoundError)
        throw new NotFoundException(exception.message);
      throw new InternalServerErrorException();
    } catch (error) {
      this.logger.error(error);
      this.baseFilter.catch(error, host);
    }
  }
}
