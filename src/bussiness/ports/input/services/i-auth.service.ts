import { User } from 'src/bussiness/entities/user.entity';
import { CreateUserInput } from './dtos/input/create-user.input';
import { TokenOutput } from './dtos/output/token.output';

export abstract class IAuthService {
  abstract register(register: CreateUserInput): Promise<TokenOutput>;

  abstract login(user: User): Promise<TokenOutput>;

  abstract validate(email: string, password: string): Promise<User | null>;

  abstract profile(user: User): User;
}
