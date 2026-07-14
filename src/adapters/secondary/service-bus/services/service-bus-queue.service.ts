import { ServiceBusClient, ServiceBusMessage } from '@azure/service-bus';
import { Injectable, Logger } from '@nestjs/common';
import { context, propagation } from '@opentelemetry/api';
import { UnknownError } from 'src/bussiness/errors/unknown.error';

@Injectable()
export class ServiceBusQueueService {
  private readonly logger: Logger = new Logger(ServiceBusQueueService.name);

  constructor(private readonly client: ServiceBusClient) {}

  async send<T>(queue: string, data: T): Promise<void> {
    const sender = this.client.createSender(queue);
    try {
      this.logger.log(`Sending message to '${queue}' queue`);
      const message: ServiceBusMessage = { body: data, applicationProperties: {} };
      propagation.inject(context.active(), message.applicationProperties);
      await sender.sendMessages([message]);
      this.logger.log(`Message sent to '${queue}' queue`);
      await sender.close();
    } catch (error) {
      this.logger.error(`Error on send message to '${queue}' queue`);
      this.logger.error(error);
      throw new UnknownError();
    }
  }
}
