import { ClientSession, Model, mongo } from 'mongoose';
import { IEntity } from 'src/bussiness/entities/i.entity';
import { IRepository } from 'src/bussiness/ports/output/repositories/i.respository';
import { MongoTransactionService } from '../services/mongo-transaction.service';
import { plainToInstance } from 'class-transformer';
import { Logger, Type } from '@nestjs/common';
import { UnknownError } from 'src/bussiness/errors/unknown.error';
import { BussinessError } from 'src/bussiness/errors/bussiness.error';

const {
  ObjectId,
  BSON: { BSONError },
  MongoServerError,
} = mongo;

export abstract class MongoRepository<
  Entity extends IEntity<EditInput>,
  CreateInput,
  EditInput,
> implements IRepository<Entity, CreateInput, EditInput, ClientSession> {
  private logger: Logger = new Logger(MongoRepository.name);

  constructor(
    protected readonly TransformEntityClass: Type<Entity>,
    protected readonly EntityClass: Type<Entity>,
    protected readonly NotFoundErrorClass: Type<BussinessError>,
    protected readonly EntityModel: Model<Entity>,
    protected readonly transactionService: MongoTransactionService,
    protected readonly relations: Array<string> = [],
    protected readonly AlreadyExistsError?: Type<BussinessError>,
  ) {}

  async save(
    input: CreateInput,
    session?: ClientSession,
    onError: (error: any) => Promise<void> = (error) => Promise.resolve(undefined),
  ): Promise<Entity> {
    return await this.transactionService.transaction(async (session) => {
      try {
        let saveInput = input;
        if (input instanceof this.EntityClass) saveInput = { ...input, ...this.relationsSchema(input) };
        const result = await new this.EntityModel(saveInput).save({ session });
        const populated = await result.populate(this.relations);
        const plainEntity = populated.toObject();
        return plainToInstance(this.TransformEntityClass, plainEntity);
      } catch (error) {
        this.logger.error(error);
        await onError(error);
        if (this.AlreadyExistsError && error instanceof MongoServerError && error.code === 11000) {
          throw new this.AlreadyExistsError();
        }
        throw new UnknownError();
      }
    }, session);
  }

  async findOneBy(
    filter: Partial<Entity>,
    session?: ClientSession,
    onError: (error: any) => Promise<void> = (error) => Promise.resolve(undefined),
  ): Promise<Entity | null> {
    return await this.transactionService.transaction(async (session) => {
      try {
        const result = await this.EntityModel.findOne(this.normalizedFilter(filter), undefined, {
          session,
        });
        const populated = await result?.populate(this.relations);
        const plainEntity = populated?.toObject();
        return plainEntity ? plainToInstance(this.TransformEntityClass, plainEntity) : null;
      } catch (error) {
        this.logger.error(error);
        await onError(error);
        if (error instanceof BSONError) return null;
        throw new UnknownError();
      }
    }, session);
  }

  async findOneByOrFail(filter: Partial<Entity>, session?: ClientSession): Promise<Entity> {
    return await this.transactionService.transaction(async (session) => {
      const entity = await this.findOneBy(filter, session);
      if (!entity) throw new this.NotFoundErrorClass();
      return entity;
    }, session);
  }

  async find(
    filter: Partial<Entity>,
    session?: ClientSession,
    onError: (error: any) => Promise<void> = (error) => Promise.resolve(undefined),
  ): Promise<Array<Entity>> {
    return await this.transactionService.transaction(async (session) => {
      try {
        const result = await this.EntityModel.find(this.normalizedFilter(filter), undefined, { session });
        const populated = await Promise.all(result.map((result) => result.populate(this.relations)));
        const plainEntities = populated.map((result) => result.toObject());
        return plainToInstance(this.TransformEntityClass, plainEntities);
      } catch (error) {
        this.logger.error(error);
        await onError(error);
        throw new UnknownError();
      }
    }, session);
  }

  async updateOne(
    updated: Entity,
    session?: ClientSession,
    onError: (error: any) => Promise<void> = (error) => Promise.resolve(undefined),
  ): Promise<Entity> {
    return await this.transactionService.transaction(async (session) => {
      try {
        const schema = { ...updated, ...this.relationsSchema(updated) };
        const filter = this.normalizedFilter({ id: updated.id });
        const result = await this.EntityModel.updateOne(filter, schema, { session, upsert: false });
        if (!result.acknowledged && result.matchedCount === 0) throw new this.NotFoundErrorClass();
        return updated;
      } catch (error) {
        this.logger.error(error);
        await onError(error);
        if (error instanceof BSONError) throw new this.NotFoundErrorClass();
        throw new UnknownError();
      }
    }, session);
  }

  async updateMany(
    entities: Array<Entity>,
    session?: ClientSession,
    onError: (error: any) => Promise<void> = (error) => Promise.resolve(undefined),
  ): Promise<Array<Entity>> {
    return await this.transactionService.transaction(async (session) => {
      return Promise.all(entities.map(async (entity) => await this.updateOne(entity, session, onError)));
    }, session);
  }

  async deleteOneBy(
    filter: Partial<Entity>,
    session?: ClientSession,
    onError: (error: any) => Promise<void> = (error) => Promise.resolve(undefined),
  ): Promise<void> {
    return await this.transactionService.transaction(async (session) => {
      try {
        const result = await this.EntityModel.deleteOne(this.normalizedFilter(filter), { session });
        if (result.acknowledged && result.deletedCount === 0) throw new this.NotFoundErrorClass();
      } catch (error) {
        this.logger.error(error);
        await onError(error);
        if (error instanceof BSONError) throw new this.NotFoundErrorClass();
        throw new UnknownError();
      }
    }, session);
  }

  protected normalizedFilter<EditInput, Entity extends IEntity<EditInput>>({
    id,
    ...rest
  }: Partial<Entity>): { _id?: mongo.BSON.ObjectId } & Partial<Omit<Entity, 'id'>> {
    return { ...(id ? { _id: new ObjectId(id) } : {}), ...rest };
  }

  private relationsSchema(updated: Entity) {
    const updatedRelations = this.relations.filter((relation) => !!updated[relation]);
    const relationIds = {};
    updatedRelations.forEach(
      (relation) =>
        (relationIds[relation] =
          updated[relation] instanceof Array
            ? updated[relation].map((element) => element?.id)
            : updated[relation].id),
    );
    return relationIds;
  }
}
