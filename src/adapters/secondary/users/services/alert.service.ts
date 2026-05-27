import { Measurement } from 'src/bussiness/entities/measurement.entity';
import { IAlertService } from 'src/bussiness/ports/output/services/i-alert.service';
import { ServiceBusQueueService } from '../../service-bus/services/service-bus-queue.service';
import { Injectable } from '@nestjs/common';
import { NotifyAlertDto } from '../dtos/notify-alert.dto';

@Injectable()
export class AlertService implements IAlertService {
  constructor(private readonly queueService: ServiceBusQueueService) {}

  async notifyAlert(subscribers: Array<string>, measurement: Measurement): Promise<void> {
    await this.queueService.send(
      'alert',
      new NotifyAlertDto(
        subscribers,
        measurement.id!,
        measurement.datetime,
        measurement.alertType,
        measurement.pressure,
        measurement.temperature,
        measurement.humidity,
        measurement.station.id!,
      ),
    );
  }
}
