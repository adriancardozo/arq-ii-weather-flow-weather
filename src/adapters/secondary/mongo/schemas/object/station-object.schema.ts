import { Station as StationEntity } from 'src/bussiness/entities/station.entity';
import { Type } from 'class-transformer';
import { Location } from 'src/bussiness/value-objects/location.value-object';
import { Measurement } from './measurement-object.schema';

export class Station extends StationEntity {
  @Type(() => Location)
  declare location: Location;

  @Type(() => Measurement)
  declare measurements: Array<Measurement>;
}
