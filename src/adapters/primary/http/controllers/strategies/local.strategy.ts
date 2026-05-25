import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { IAuthService } from 'src/bussiness/ports/input/services/i-auth.service';
import { User } from 'src/bussiness/entities/user.entity';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: IAuthService) {
    super({ usernameField: 'email', passwordField: 'password' });
  }

  async validate(email: string, password: string): Promise<User> {
    const user = await this.authService.validate(email, password);
    if (!user) throw new UnauthorizedException();
    return user;
  }
}
