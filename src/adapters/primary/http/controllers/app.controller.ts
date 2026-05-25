import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { Configuration } from 'src/infrastructure/configuration/configuration';
import { VersionResponse } from './responses/version.response';

@Controller()
export class AppController {
  private app: Configuration['app'];

  constructor(private readonly configService: ConfigService) {
    this.app = this.configService.get('app')!;
  }

  @ApiOperation({ summary: 'Health check' })
  @Get()
  healthCheck(): string {
    return this.app.health_string;
  }

  @ApiOperation({ summary: 'Version' })
  @ApiOkResponse({ type: VersionResponse })
  @Get('version')
  version(): VersionResponse {
    return new VersionResponse(this.app.version);
  }
}
