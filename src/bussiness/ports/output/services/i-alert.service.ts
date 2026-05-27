import { Measurement } from 'src/bussiness/entities/measurement.entity';

export abstract class IAlertService {
  abstract notifyAlert(subscribers: Array<string>, measurement: Measurement): Promise<void>;
}
