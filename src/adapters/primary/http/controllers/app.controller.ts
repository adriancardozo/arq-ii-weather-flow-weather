import { Controller, Get, Request, Response } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { Configuration } from 'src/infrastructure/configuration/configuration';
import { VersionResponse } from './responses/version.response';
import type { Request as ExpressRequest, Response as ExpressReponse } from 'express';
import { PrometheusExporter } from '@opentelemetry/exporter-prometheus';

@Controller()
export class AppController {
  private app: Configuration['app'];

  constructor(
    private readonly configService: ConfigService,
    private readonly exporter: PrometheusExporter,
  ) {
    this.app = this.configService.get('app')!;
  }

  @ApiOperation({ summary: 'Health check' })
  @Get()
  healthCheck(): string {
    return this.app.health_string;
  }

  @ApiOperation({ summary: 'Metrics' })
  @Get('/metrics')
  metrics(@Request() request: ExpressRequest, @Response() response: ExpressReponse) {
    this.exporter.getMetricsRequestHandler(request, response);
  }

  @ApiOperation({ summary: 'Version' })
  @ApiOkResponse({ type: VersionResponse })
  @Get('version')
  version(): VersionResponse {
    return new VersionResponse(this.app.version);
  }
}
