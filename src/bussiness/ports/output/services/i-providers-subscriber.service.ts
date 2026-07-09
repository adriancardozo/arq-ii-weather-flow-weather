import { Station } from 'src/bussiness/entities/station.entity';

export abstract class IProvidersSubscriberService {
  abstract sendToCreate(station: Station): Promise<void>;

  abstract sendToEdit(station: Station): Promise<void>;

  abstract sendToDelete(station: Station): Promise<void>;
}
