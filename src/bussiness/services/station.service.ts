import { Injectable } from '@nestjs/common';
import { IStationService } from '../ports/input/services/i-station.service';
import { IStationRepository } from '../ports/output/repositories/i-station.repository';
import { Station } from '../entities/station.entity';
import { CreateStationInput } from '../ports/input/services/dtos/input/create-station.input';
import { EditStationInput } from '../ports/input/services/dtos/input/edit-station.input';
import { ITransactionService } from '../ports/output/services/i-transaction.service';
import { Service } from './service';
import { SearchInput } from '../ports/input/services/dtos/input/search.input';
import { Search } from '../aggregates/search.aggergate';
import { SearchStationInput } from '../ports/input/services/dtos/input/search-station.input';
import { IUserStationService } from '../ports/output/services/i-user-station.service';

@Injectable()
export class StationService<Session = any>
  extends Service<Station, CreateStationInput, EditStationInput, Session>
  implements IStationService
{
  constructor(
    private readonly userStationService: IUserStationService,
    stationRepository: IStationRepository,
    transactionService: ITransactionService,
  ) {
    super(stationRepository, transactionService);
  }

  override async create(input: CreateStationInput, session?: Session): Promise<Station> {
    return await this.transactionService.transaction(async (session) => {
      const station = await super.create(input, session);
      await this.userStationService.updateOwner(station.id, null, station.owner);
      return station;
    }, session);
  }

  override async edit(id: string, input: EditStationInput, session?: Session): Promise<Station> {
    return await this.transactionService.transaction(async (session) => {
      if (!input.owner) return await super.edit(id, input, session);
      const { owner: oldOwner } = await this.repository.findOneByOrFail({ id }, session);
      const station = await super.edit(id, input, session);
      await this.userStationService.updateOwner(station.id, oldOwner, station.owner);
      return station;
    }, session);
  }

  override async delete(id: string, session?: Session): Promise<Station> {
    return await this.transactionService.transaction(async (session) => {
      const station = await super.delete(id, session);
      await this.userStationService.updateOwner(station.id, station.owner, null);
      return station;
    }, session);
  }

  async subscribe(id: string, userId: string, session?: Session): Promise<Station> {
    return await this.transactionService.transaction(async (session) => {
      const station = await this.repository.findOneByOrFail({ id }, session);
      await this.userStationService.addSubscription(userId, station.id);
      station.subscribe(userId);
      return await this.repository.updateOne(station, session);
    }, session);
  }

  async search(input: SearchInput, session?: Session): Promise<Search> {
    return await this.transactionService.transaction(async (session) => {
      const station = await this.repository.findOneByOrFail(
        { name: { $regex: `${input.station}`, $options: 'i' } as any as string },
        session,
      );
      return station.search(input);
    }, session);
  }

  async searchStations(input: SearchStationInput, session?: Session): Promise<Station[]> {
    return await this.transactionService.transaction(async (session) => {
      const stations = await this.repository.find(
        { name: { $regex: `${input.station}`, $options: 'i' } as any as string },
        session,
      );
      return stations;
    }, session);
  }
}
