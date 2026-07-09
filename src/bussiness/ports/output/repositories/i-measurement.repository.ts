import { Measurement } from 'src/bussiness/entities/measurement.entity';
import { IRepository } from './i.repository';
import { EditMeasurementInput } from '../../input/services/dtos/input/edit-measurement.input';

export abstract class IMeasurementRepository<Session = any> extends IRepository<
  Measurement,
  Measurement,
  EditMeasurementInput,
  Session
> {
  abstract getLastMeasurements(id: string, from: Date, session?: Session): Promise<Array<Measurement>>;
}
