import { User } from 'src/bussiness/entities/user.entity';
import { CreateUserInput } from '../../input/services/dtos/input/create-user.input';
import { IRepository } from './i.respository';
import { EditUserInput } from '../../input/services/dtos/input/edit-user.input';

export abstract class IUserRepository<Session = any> extends IRepository<
  User,
  CreateUserInput,
  EditUserInput,
  Session
> {}
