import { Station } from 'src/bussiness/entities/station.entity';
import { IProvidersSubscriberService } from 'src/bussiness/ports/output/services/i-providers-subscriber.service';

export class MockProvidersSubscriberService implements IProvidersSubscriberService {
  sendToCreate(station: Station): Promise<void> {
    throw new Error('Method not implemented.');
  }
  sendToEdit(station: Station): Promise<void> {
    throw new Error('Method not implemented.');
  }
  sendToDelete(station: Station): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
