import { Station } from 'src/bussiness/entities/station.entity';
import { CreateStationInput } from 'src/bussiness/ports/input/services/dtos/input/create-station.input';
import { IStationRepository } from 'src/bussiness/ports/output/repositories/i-station.repository';

export class MockStationRepository implements IStationRepository {
  updateMany(stations: Station[], session?: any): Promise<Station[]> {
    throw new Error('Method not implemented.');
  }
  save(input: CreateStationInput, session?: any): Promise<Station> {
    throw new Error('Method not implemented.');
  }
  findOneBy(filter: Partial<Station>, session?: any): Promise<Station | null> {
    throw new Error('Method not implemented.');
  }
  findOneByOrFail(filter: Partial<Station>, session?: any): Promise<Station> {
    throw new Error('Method not implemented.');
  }
  deleteOneBy(filter: Partial<Station>, session?: any): Promise<void> {
    throw new Error('Method not implemented.');
  }
  updateOne(updated: Station, session?: any): Promise<Station> {
    throw new Error('Method not implemented.');
  }
  find(filter: Partial<Station>, session?: any): Promise<Station[]> {
    throw new Error('Method not implemented.');
  }
}
