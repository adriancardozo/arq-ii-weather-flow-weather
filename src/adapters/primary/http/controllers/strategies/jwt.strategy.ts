import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IUserService } from 'src/bussiness/ports/input/services/i-user.service';
import { LoginInput } from 'src/bussiness/ports/input/services/dtos/input/login.input';
import { User } from 'src/bussiness/entities/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly userService: IUserService,
    configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('jwt.secret')!,
    });
  }

  async validate({ email }: LoginInput): Promise<User | null> {
    return await this.userService.findOneByEmail(email);
  }
}
