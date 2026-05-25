import { Station as StationEntity } from 'src/bussiness/entities/station.entity';
import { User } from './user-object.schema';
import { Type } from 'class-transformer';
import { Location } from 'src/bussiness/value-objects/location.value-object';
import { Measurement } from './measurement-object.schema';

export class Station extends StationEntity {
  @Type(() => Location)
  declare location: Location;

  @Type(() => User)
  declare owner: User;

  @Type(() => Measurement)
  declare measurements: Array<Measurement>;

  @Type(() => User)
  declare subscribers: Array<User>;
}
