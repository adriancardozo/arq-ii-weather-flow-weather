import { Measurement } from 'src/bussiness/entities/measurement.entity';
import { IRepository } from './i.respository';
import { EditMeasurementInput } from '../../input/services/dtos/input/edit-measurement.input';

export abstract class IMeasurementRepository<Session = any> extends IRepository<
  Measurement,
  Measurement,
  EditMeasurementInput,
  Session
> {}
