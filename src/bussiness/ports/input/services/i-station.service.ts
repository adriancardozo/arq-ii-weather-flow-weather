import { Station } from 'src/bussiness/entities/station.entity';
import { EditStationInput } from './dtos/input/edit-station.input';
import { CreateStationInput } from './dtos/input/create-station.input';
import { SearchInput } from './dtos/input/search.input';
import { Search } from 'src/bussiness/aggregates/search.aggergate';

export abstract class IStationService {
  abstract getAll(): Promise<Array<Station>>;

  abstract getById(id: string): Promise<Station>;

  abstract edit(id: string, input: EditStationInput): Promise<Station>;

  abstract delete(id: string): Promise<Station>;

  abstract create(input: CreateStationInput): Promise<Station>;

  abstract subscribe(id: string, user_id: string): Promise<Station>;

  abstract search(query: SearchInput): Promise<Search>;
}
