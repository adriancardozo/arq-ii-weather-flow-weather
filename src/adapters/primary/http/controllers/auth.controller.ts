import { Body, Controller, Get, Post, Request, UseFilters, UseGuards, UsePipes } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { TokenResponse } from './responses/token.response';
import { CreateUserDto } from './dtos/create-user.dto';
import { IAuthService } from 'src/bussiness/ports/input/services/i-auth.service';
import { VALIDATION_PIPE } from 'src/infrastructure/validation/validation.pipe';
import { BussinessExceptionFilter } from './filters/bussiness-error.filter';
import { LoginDto } from './dtos/login.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { UserResponse } from './responses/user.response';
import type { UserRequest } from './types/user-request.type';

@Controller('auth')
@UsePipes(VALIDATION_PIPE)
@UseFilters(BussinessExceptionFilter)
export class AuthController {
  constructor(private readonly authService: IAuthService) {}

  @ApiOperation({ summary: 'Register' })
  @ApiOkResponse({ type: TokenResponse })
  @ApiBody({ type: CreateUserDto })
  @Post('register')
  async register(@Body() dto: CreateUserDto): Promise<TokenResponse> {
    return new TokenResponse(await this.authService.register(dto.toInput()));
  }

  @ApiOperation({ summary: 'Login' })
  @ApiOkResponse({ type: TokenResponse })
  @ApiBody({ type: LoginDto })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() { user }: UserRequest): Promise<TokenResponse> {
    return new TokenResponse(await this.authService.login(user));
  }

  @ApiOperation({ summary: 'Profile' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: UserResponse })
  @Get('profile')
  profile(@Request() { user }: UserRequest): UserResponse {
    return new UserResponse(this.authService.profile(user));
  }
}
