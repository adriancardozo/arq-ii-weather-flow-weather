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

@Injectable()
export class StationService<Session = any>
  extends Service<Station, CreateStationInput, EditStationInput, Session>
  implements IStationService
{
  constructor(stationRepository: IStationRepository, transactionService: ITransactionService) {
    super(stationRepository, transactionService);
  }

  override async create(input: CreateStationInput, session?: Session): Promise<Station> {
    return await this.transactionService.transaction(async (session) => {
      const station = await super.create(input, session);
      // TODO: Ver como resolver actualización de estaciones del usuario owner al crear la estación
      // station.owner.addStation(station);
      // await this.userRepository.updateOne(station.owner, session);
      return station;
    }, session);
  }

  override async edit(id: string, input: EditStationInput, session?: Session): Promise<Station> {
    return await this.transactionService.transaction(async (session) => {
      if (!input.owner) return await super.edit(id, input, session);
      // TODO: Ver cómo resolver la actualización del owner viejo y el nuevo si se edita el owner de la estación
      // const {
      //   owner: { id: oldId },
      // } = await this.repository.findOneByOrFail({ id }, session);
      const station = await super.edit(id, input, session);
      // const oldOwner = await this.userRepository.findOneByOrFail({ id: oldId }, session);
      // const owner = await this.userRepository.findOneByOrFail({ id: input.owner.id }, session);
      // oldOwner.removeStation(id);
      // owner.addStation(station);
      // await this.userRepository.updateMany([oldOwner, owner], session);
      return station;
    }, session);
  }

  override async delete(id: string, session?: Session): Promise<Station> {
    return await this.transactionService.transaction(async (session) => {
      const station = await super.delete(id, session);
      // TODO: Ver cómo resolver la actualización del owner al borrar la estación
      // if (station.owner?.id) {
      //   const { id: ownerId } = station.owner;
      //   const owner = await this.userRepository.findOneByOrFail({ id: ownerId }, session);
      //   owner.removeStation(id);
      //   await this.userRepository.updateOne(owner, session);
      // }
      return station;
    }, session);
  }

  async subscribe(id: string, userId: string, session?: Session): Promise<Station> {
    return await this.transactionService.transaction(async (session) => {
      const station = await this.repository.findOneByOrFail({ id }, session);
      // TODO: Evaluar si resolver como actualizar al usuario suscripto en el otro microservicio
      // const user = await this.userRepository.findOneByOrFail({ id: userId }, session);
      // station.subscribe(user);
      // await this.userRepository.updateOne(user, session);
      return await this.repository.updateOne(station, session);
    }, session);
  }

  async search(input: SearchInput, session?: Session): Promise<Search> {
    return await this.transactionService.transaction(async (session) => {
      const station = await this.repository.findOneByOrFail({ name: input.station }, session);
      return station.search(input);
    }, session);
  }
}
