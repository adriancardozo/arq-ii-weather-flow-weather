import { Injectable, Logger } from '@nestjs/common';
import { IMeasurementService } from '../ports/input/services/i-measurement.service';
import { IMeasurementRepository } from '../ports/output/repositories/i-measurement.repository';
import { Service } from './service';
import { Measurement } from '../entities/measurement.entity';
import { EditMeasurementInput } from '../ports/input/services/dtos/input/edit-measurement.input';
import { RegisterMeasurementInput } from '../ports/input/services/dtos/input/register-measurement.input';
import { ITransactionService } from '../ports/output/services/i-transaction.service';
import { IStationRepository } from '../ports/output/repositories/i-station.repository';
import { IAlertService } from '../ports/output/services/i-alert.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MeasurementService<Session = any>
  extends Service<Measurement, RegisterMeasurementInput | Measurement, EditMeasurementInput, Session>
  implements IMeasurementService
{
  private readonly logger = new Logger(MeasurementService.name);
  private readonly fallbackEnabled: boolean;

  constructor(
    measurementRepository: IMeasurementRepository,
    transactionService: ITransactionService,
    private readonly alertService: IAlertService,
    private readonly stationRepository: IStationRepository,
    private readonly configService: ConfigService,
  ) {
    super(measurementRepository, transactionService);
    this.fallbackEnabled = this.configService.get<boolean>('alerts.fallback_enabled') ?? true;
  }

  override async create(input: RegisterMeasurementInput, session?: Session): Promise<Measurement> {
    return await this.transactionService.transaction(async (session) => {
      const station = await this.stationRepository.findOneByOrFail({ id: input.station }, session);
      const measurement = await this.repository.save(
        new Measurement(undefined, input.pressure, input.temperature, input.humidity, station, new Date()),
        session,
      );
      station.addMeasurement(measurement);
      if (measurement.alert) await this.notifyAlertWithFallback(station.subscribers, measurement);
      await this.stationRepository.updateOne(station, session);
      return measurement;
    }, session);
  }

  private async notifyAlertWithFallback(
    subscribers: Array<string>,
    measurement: Measurement,
  ): Promise<void> {
    try {
      await this.alertService.notifyAlert(subscribers, measurement);
    } catch (error) {
      if (!this.fallbackEnabled) throw error;
      this.logger.warn('Fallback activated for alert notification: service-bus unavailable');
    }
  }
}
