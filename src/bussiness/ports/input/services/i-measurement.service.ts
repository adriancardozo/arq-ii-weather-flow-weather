import { Measurement } from 'src/bussiness/entities/measurement.entity';
import { EditMeasurementInput } from './dtos/input/edit-measurement.input';
import { RegisterMeasurementInput } from './dtos/input/register-measurement.input';

export abstract class IMeasurementService {
  abstract getAll(): Promise<Array<Measurement>>;

  abstract getById(id: string): Promise<Measurement>;

  abstract edit(id: string, input: EditMeasurementInput): Promise<Measurement>;

  abstract delete(id: string): Promise<Measurement>;

  abstract create(input: RegisterMeasurementInput): Promise<Measurement>;
}
