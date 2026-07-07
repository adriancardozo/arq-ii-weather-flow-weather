import { ServiceBusClient, ServiceBusAdministrationClient } from '@azure/service-bus';
import { ServiceBusProcessor } from './service-bus-processor.helper';
import { Injectable, Type } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ServiceBusProcessorManager {
  private readonly processors: Array<ServiceBusProcessor> = [];
  private readonly emulated: boolean;

  constructor(
    private readonly client: ServiceBusClient,
    private readonly adminClient: ServiceBusAdministrationClient,
    configService: ConfigService,
  ) {
    this.emulated = configService.get<boolean>('service_bus.emulated')!;
  }

  async onModuleInit() {
    for (const processor of this.processors) {
      await processor.initialize();
      processor.bind();
    }
  }

  async onModuleDestroy() {
    for (const processor of this.processors) await processor.close();
    await this.client.close();
  }

  add<T>(queue: string, callback: (data: T) => Promise<void>, DtoClass?: Type<T>) {
    this.processors.push(
      new ServiceBusProcessor<T>(this.client, this.adminClient, this.emulated, queue, callback, DtoClass),
    );
  }
}
