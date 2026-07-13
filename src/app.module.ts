import { Logger, MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './adapters/primary/http/controllers/app.controller';
import { IStationService } from './bussiness/ports/input/services/i-station.service';
import { IMeasurementService } from './bussiness/ports/input/services/i-measurement.service';
import { MongoMeasurementRepository } from './adapters/secondary/mongo/repositories/mongo-measurement.repository';
import { MongoStationRepository } from './adapters/secondary/mongo/repositories/mongo-station.repository';
import { IMeasurementRepository } from './bussiness/ports/output/repositories/i-measurement.repository';
import { IStationRepository } from './bussiness/ports/output/repositories/i-station.repository';
import { MeasurementService } from './bussiness/services/measurement.service';
import { StationService } from './bussiness/services/station.service';
import { MeasurementController } from './adapters/primary/http/controllers/measurement.controller';
import { StationController } from './adapters/primary/http/controllers/station.controller';
import { ConfigModule } from '@nestjs/config';
import configuration from './infrastructure/configuration/configuration';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { BcryptHashService } from './adapters/secondary/bcrypt/services/bcrypt-hash.service';
import { IHashService } from './bussiness/ports/output/services/i-hash.service';
import { MongoTransactionService } from './adapters/secondary/mongo/services/mongo-transaction.service';
import { ITransactionService } from './bussiness/ports/output/services/i-transaction.service';
import { PassportModule } from '@nestjs/passport';
import { Station } from './bussiness/entities/station.entity';
import { StationSchema } from './adapters/secondary/mongo/schemas/document/station.schema';
import { Measurement } from './bussiness/entities/measurement.entity';
import { MeasurementSchema } from './adapters/secondary/mongo/schemas/document/measurement.schema';
import { SearchController } from './adapters/primary/http/controllers/search.controller';
import { ServiceBusQueueService } from './adapters/secondary/service-bus/services/service-bus-queue.service';
import { ServiceBusAdministrationClient, ServiceBusClient } from '@azure/service-bus';
import { IAlertService } from './bussiness/ports/output/services/i-alert.service';
import { AlertService } from './adapters/secondary/users/services/alert.service';
import { HttpModule } from '@nestjs/axios';
import { UserStationService } from './adapters/secondary/users/services/user-station.service';
import { IUserStationService } from './bussiness/ports/output/services/i-user-station.service';
import { ServiceBusProcessorManager } from './adapters/primary/queue/helpers/service-bus-processor-manager.helper';
import { MeasurementProcessor } from './adapters/primary/queue/processors/measurement.processor';
import { OpenWeatherMapProviderService } from './adapters/secondary/open-weather-map/services/open-weather-map-provider.service';
import { IWeatherProviderService } from './bussiness/ports/output/services/i-weather-provider.service';
import { ProvidersSubscriberService } from './adapters/secondary/providers/services/providers-subscriber.service';
import { IProvidersSubscriberService } from './bussiness/ports/output/services/i-providers-subscriber.service';
import { CacheModule } from '@nestjs/cache-manager';
import { Keyv } from 'keyv';
import { PrometheusExporter } from '@opentelemetry/exporter-prometheus';
import { exporter } from './infrastructure/open-telemetry/instrumentation';
import { MetricsMiddleware } from './adapters/primary/http/middlewares/metrics.middleware';

const { mongo, jwt, service_bus, redis, cache } = configuration();

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    MongooseModule.forRoot(mongo.uri),
    MongooseModule.forFeature([
      { name: Station.name, schema: StationSchema },
      { name: Measurement.name, schema: MeasurementSchema },
    ]),
    JwtModule.register({ global: true, secret: jwt.secret, signOptions: { expiresIn: '10d' } }),
    PassportModule,
    HttpModule,
    CacheModule.registerAsync({
      useFactory: async () => {
        if (cache.disabled) return { stores: [], ttl: -1 };
        const { default: KeyvRedis } = await import('@keyv/redis');
        return { stores: [new Keyv(), ...(redis.url ? [new KeyvRedis(redis.url, redis.options)] : [])] };
      },
    }),
  ],
  controllers: [AppController, MeasurementController, StationController, SearchController],
  providers: [
    { provide: ServiceBusClient, useValue: new ServiceBusClient(service_bus.connection_string) },
    {
      provide: ServiceBusAdministrationClient,
      useValue: new ServiceBusAdministrationClient(service_bus.connection_string),
    },
    ServiceBusProcessorManager,
    MeasurementProcessor,
    Logger,
    MeasurementService,
    { provide: IMeasurementService, useExisting: MeasurementService },
    StationService,
    { provide: IStationService, useExisting: StationService },
    BcryptHashService,
    { provide: IHashService, useExisting: BcryptHashService },
    MongoTransactionService,
    { provide: ITransactionService, useExisting: MongoTransactionService },
    MongoMeasurementRepository,
    { provide: IMeasurementRepository, useExisting: MongoMeasurementRepository },
    MongoStationRepository,
    { provide: IStationRepository, useExisting: MongoStationRepository },
    ServiceBusQueueService,
    AlertService,
    { provide: IAlertService, useExisting: AlertService },
    UserStationService,
    { provide: IUserStationService, useExisting: UserStationService },
    OpenWeatherMapProviderService,
    { provide: IWeatherProviderService, useExisting: OpenWeatherMapProviderService },
    ProvidersSubscriberService,
    { provide: IProvidersSubscriberService, useExisting: ProvidersSubscriberService },
    { provide: PrometheusExporter, useValue: exporter },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(MetricsMiddleware).exclude('/metrics').forRoutes('*');
  }
}
