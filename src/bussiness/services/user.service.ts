import { Injectable } from '@nestjs/common';
import { IUserService } from '../ports/input/services/i-user.service';
import { IUserRepository } from '../ports/output/repositories/i-user.repository';
import { User } from '../entities/user.entity';
import { CreateUserInput } from '../ports/input/services/dtos/input/create-user.input';
import { IHashService } from '../ports/output/services/i-hash.service';
import { ITransactionService } from '../ports/output/services/i-transaction.service';
import { EditUserInput } from '../ports/input/services/dtos/input/edit-user.input';
import { Service } from './service';
import { IStationRepository } from '../ports/output/repositories/i-station.repository';

@Injectable()
export class UserService<Session = any>
  extends Service<User, CreateUserInput, EditUserInput, Session>
  implements IUserService
{
  constructor(
    userRepository: IUserRepository,
    private readonly stationRepository: IStationRepository,
    private readonly hashService: IHashService,
    transactionService: ITransactionService,
  ) {
    super(userRepository, transactionService);
  }

  override async delete(id: string, session?: Session): Promise<User> {
    return await this.transactionService.transaction(async (session) => {
      const user = await super.delete(id, session);
      user.stations.forEach((station) => station.setOwner(null));
      await this.stationRepository.updateMany(user.stations, session);
      return user;
    }, session);
  }

  override async create(input: CreateUserInput, session?: Session): Promise<User> {
    return await this.transactionService.transaction(async (session) => {
      const password = await this.hashService.hash(input.password);
      return await super.create({ ...input, password }, session);
    }, session);
  }

  async findOneByEmail(email: string, session?: Session): Promise<User | null> {
    return await this.transactionService.transaction(async (session) => {
      return await this.repository.findOneBy({ email }, session);
    }, session);
  }
}
