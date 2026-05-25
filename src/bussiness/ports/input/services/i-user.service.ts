import { User } from 'src/bussiness/entities/user.entity';
import { CreateUserInput } from './dtos/input/create-user.input';
import { EditUserInput } from './dtos/input/edit-user.input';

export abstract class IUserService {
  abstract create(register: CreateUserInput): Promise<User>;

  abstract findOneByEmail(email: string): Promise<User | null>;

  abstract edit(id: string, input: EditUserInput): Promise<User>;

  abstract delete(id: string): Promise<User>;

  abstract getAll(): Promise<Array<User>>;

  abstract getById(id: string): Promise<User>;
}
