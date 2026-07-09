import { Station } from 'src/bussiness/entities/station.entity';
import { IProvidersSubscriberService } from 'src/bussiness/ports/output/services/i-providers-subscriber.service';
import { ServiceBusQueueService } from '../../service-bus/services/service-bus-queue.service';
import { CreateSubscriberDto } from './dtos/create-subscriber.dto';
import { EditSubscriberDto } from './dtos/edit-subscriber.dto';
import { DeleteSubscriberDto } from './dtos/delete-subscriber.dto';
import { SubscriberDto } from './dtos/subscriber.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ProvidersSubscriberService implements IProvidersSubscriberService {
  constructor(private readonly queueService: ServiceBusQueueService) {}

  async sendToCreate(station: Station): Promise<void> {
    const dto = new SubscriberDto(
      'create',
      new CreateSubscriberDto(
        station.id!,
        station.name,
        station.provider!,
        station.location.longitude,
        station.location.latitude,
        'MeasurementQueue',
      ),
    );
    await this.queueService.send('providers-subscriber', dto);
  }

  async sendToEdit(station: Station): Promise<void> {
    const dto = new SubscriberDto(
      'edit',
      undefined,
      new EditSubscriberDto(
        station.id!,
        station.name,
        station.provider!,
        station.location.longitude,
        station.location.latitude,
        'MeasurementQueue',
      ),
    );
    await this.queueService.send('providers-subscriber', dto);
  }

  async sendToDelete(station: Station): Promise<void> {
    const dto = new SubscriberDto('delete', undefined, undefined, new DeleteSubscriberDto(station.id!));
    await this.queueService.send('providers-subscriber', dto);
  }
}
