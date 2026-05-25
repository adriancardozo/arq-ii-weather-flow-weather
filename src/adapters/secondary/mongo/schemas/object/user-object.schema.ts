import { User as UserEntity } from 'src/bussiness/entities/user.entity';
import { Station } from './station-object.schema';
import { Type } from 'class-transformer';
import { Measurement } from './measurement-object.schema';

export class User extends UserEntity {
  @Type(() => Station)
  declare stations: Array<Station>;
  @Type(() => Station)
  declare subscriptions: Array<Station>;
  @Type(() => Measurement)
  declare alerts: Array<Measurement>;
}
