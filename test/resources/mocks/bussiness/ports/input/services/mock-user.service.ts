import { User } from 'src/bussiness/entities/user.entity';
import { CreateUserInput } from 'src/bussiness/ports/input/services/dtos/input/create-user.input';
import { EditUserInput } from 'src/bussiness/ports/input/services/dtos/input/edit-user.input';
import { IUserService } from 'src/bussiness/ports/input/services/i-user.service';

export class MockUserService implements IUserService {
  getAll(): Promise<Array<User>> {
    throw new Error('Method not implemented.');
  }
  getById(id: string): Promise<User> {
    throw new Error('Method not implemented.');
  }
  create(register: CreateUserInput): Promise<User> {
    throw new Error('Method not implemented.');
  }
  findOneByEmail(email: string): Promise<User | null> {
    throw new Error('Method not implemented.');
  }
  edit(id: string, input: EditUserInput): Promise<User> {
    throw new Error('Method not implemented.');
  }
  delete(id: string): Promise<User> {
    throw new Error('Method not implemented.');
  }
}
