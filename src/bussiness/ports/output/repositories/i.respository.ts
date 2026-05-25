import { IEntity } from 'src/bussiness/entities/i.entity';

export abstract class IRepository<
  Entity extends IEntity<EditInput>,
  CreateInput,
  EditInput = any,
  Session = any,
> {
  abstract save(input: CreateInput, session?: Session): Promise<Entity>;

  abstract findOneBy(filter: Partial<Entity>, session?: Session): Promise<Entity | null>;

  abstract findOneByOrFail(filter: Partial<Entity>, session?: Session): Promise<Entity>;

  abstract deleteOneBy(filter: Partial<Entity>, session?: Session): Promise<void>;

  abstract updateOne(updated: Entity, session?: Session): Promise<Entity>;

  abstract updateMany(entities: Array<Entity>, session?: Session): Promise<Array<Entity>>;

  abstract find(filter: Partial<Entity>, session?: Session): Promise<Array<Entity>>;
}
