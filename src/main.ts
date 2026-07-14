import 'src/infrastructure/open-telemetry/instrumentation';
import { NestApplication, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Configuration } from './infrastructure/configuration/configuration';
import { CONFIG_SERVICE } from './infrastructure/configuration/config.service';
import dns from 'dns';
import { OpenTelemetryLoggerService } from './infrastructure/logger/open-telemetry-logger.service';

async function bootstrap() {
  const appConfig = CONFIG_SERVICE.get<Configuration['app']>('app')!;
  dns.setServers(appConfig.dns_servers);
  const app = await NestFactory.create(AppModule, {
    logger: new OpenTelemetryLoggerService(),
    ...appConfig.options,
  });
  app.useLogger(app.get(OpenTelemetryLoggerService));
  const config = new DocumentBuilder()
    .setTitle(appConfig.title)
    .setDescription(appConfig.description)
    .setVersion(appConfig.api_version)
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(appConfig.docs.path, app, documentFactory);
  await app.listen(appConfig.port);
  const logger = app.get(Logger);
  logger.log(`Serving at: ${await app.getUrl()}`, NestApplication.name);
  logger.log(`API docs: ${await app.getUrl()}/${appConfig.docs.path}`, NestApplication.name);
}
void bootstrap();
