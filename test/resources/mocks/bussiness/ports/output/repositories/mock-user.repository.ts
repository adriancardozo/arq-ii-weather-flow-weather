import { User } from 'src/bussiness/entities/user.entity';
import { CreateUserInput } from 'src/bussiness/ports/input/services/dtos/input/create-user.input';
import { IUserRepository } from 'src/bussiness/ports/output/repositories/i-user.repository';

export class MockUserRepository implements IUserRepository {
  updateMany(stations: User[], session?: any): Promise<User[]> {
    throw new Error('Method not implemented.');
  }
  find(filter: Partial<User>, session?: any): Promise<Array<User>> {
    throw new Error('Method not implemented.');
  }
  save(input: CreateUserInput, session?: any): Promise<User> {
    throw new Error('Method not implemented.');
  }
  findOneBy(filter: Partial<User>, session?: any): Promise<User | null> {
    throw new Error('Method not implemented.');
  }
  findOneByOrFail(filter: Partial<User>, session?: any): Promise<User> {
    throw new Error('Method not implemented.');
  }
  deleteOneBy(filter: Partial<User>, session?: any): Promise<void> {
    throw new Error('Method not implemented.');
  }
  updateOne(updated: User, session?: any): Promise<User> {
    throw new Error('Method not implemented.');
  }
}
