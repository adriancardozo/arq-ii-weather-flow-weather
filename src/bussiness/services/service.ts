import { IEntity } from '../entities/i.entity';
import { IRepository } from '../ports/output/repositories/i.respository';
import { ITransactionService } from '../ports/output/services/i-transaction.service';

export abstract class Service<Entity extends IEntity<EditInput>, CreateInput, EditInput, Session = any> {
  constructor(
    protected readonly repository: IRepository<Entity, CreateInput, EditInput, Session>,
    protected readonly transactionService: ITransactionService<Session>,
  ) {}

  async getAll(session?: Session): Promise<Array<Entity>> {
    return await this.transactionService.transaction(async (session) => {
      return await this.repository.find({}, session);
    }, session);
  }

  async getById(id: string, session?: Session): Promise<Entity> {
    return await this.transactionService.transaction(async (session) => {
      return await this.repository.findOneByOrFail({ id } as Partial<Entity>, session);
    }, session);
  }

  async create(input: CreateInput, session?: Session): Promise<Entity> {
    return await this.transactionService.transaction(async (session) => {
      return await this.repository.save(input, session);
    }, session);
  }

  async edit(id: string, input: EditInput, session?: Session): Promise<Entity> {
    return await this.transactionService.transaction(async (session) => {
      const entity = await this.repository.findOneByOrFail({ id } as Partial<Entity>, session);
      entity.edit(input);
      return await this.repository.updateOne(entity, session);
    }, session);
  }

  async delete(id: string, session?: Session): Promise<Entity> {
    return await this.transactionService.transaction(async (session) => {
      const user = await this.repository.findOneByOrFail({ id } as Partial<Entity>, session);
      await this.repository.deleteOneBy({ id } as Partial<Entity>, session);
      return user;
    }, session);
  }
}
