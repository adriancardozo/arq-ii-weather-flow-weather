import { ApiProperty } from '@nestjs/swagger';
import { TokenOutput } from 'src/bussiness/ports/input/services/dtos/output/token.output';

export class TokenResponse {
  @ApiProperty()
  access_token: string;

  constructor(output: TokenOutput) {
    this.access_token = output.accessToken;
  }
}
