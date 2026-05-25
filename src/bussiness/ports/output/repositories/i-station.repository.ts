import { Station } from 'src/bussiness/entities/station.entity';
import { IRepository } from './i.respository';
import { CreateStationInput } from '../../input/services/dtos/input/create-station.input';
import { EditStationInput } from '../../input/services/dtos/input/edit-station.input';

export abstract class IStationRepository<Session = any> extends IRepository<
  Station,
  CreateStationInput,
  EditStationInput,
  Session
> {}
