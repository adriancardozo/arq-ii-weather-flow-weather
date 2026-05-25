import { Injectable } from '@nestjs/common';
import { IAuthService } from '../ports/input/services/i-auth.service';
import { CreateUserInput } from '../ports/input/services/dtos/input/create-user.input';
import { TokenOutput } from '../ports/input/services/dtos/output/token.output';
import { JwtService } from '@nestjs/jwt';
import { ITransactionService } from '../ports/output/services/i-transaction.service';
import { UserService } from './user.service';
import { User } from '../entities/user.entity';
import { IHashService } from '../ports/output/services/i-hash.service';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly transactionService: ITransactionService,
    private readonly hashService: IHashService,
  ) {}

  async validate(email: string, password: string): Promise<User | null> {
    const user = await this.userService.findOneByEmail(email);
    if (user && this.match(password, user.password)) return user;
    return null;
  }

  async register<Session>(register: CreateUserInput, session?: Session): Promise<TokenOutput> {
    return await this.transactionService.transaction(async (session) => {
      const user = await this.userService.create(register, session);
      return await this.login(user);
    }, session);
  }

  async login(user: User): Promise<TokenOutput> {
    return new TokenOutput(await this.jwtService.signAsync(user.loginInput().plain()));
  }

  profile(user: User): User {
    return user;
  }

  private match(password: string, hash: string): boolean {
    return this.hashService.compare(password, hash);
  }
}
