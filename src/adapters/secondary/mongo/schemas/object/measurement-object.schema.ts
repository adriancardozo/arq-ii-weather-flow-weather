import { Measurement as MeasurementEntity } from 'src/bussiness/entities/measurement.entity';
import { Type } from 'class-transformer';
import { Station } from './station-object.schema';

export class Measurement extends MeasurementEntity {
  @Type(() => Station)
  declare station: Station;
}
