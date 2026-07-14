import {
  ProcessErrorArgs,
  ServiceBusAdministrationClient,
  ServiceBusClient,
  ServiceBusMessage,
  ServiceBusReceiver,
  ServiceBusError,
} from '@azure/service-bus';
import { Logger, Type } from '@nestjs/common';
import { VALIDATION_PIPE } from 'src/infrastructure/validation/validation.pipe';
import { QueueMiddleware } from '../middlewares/queue.middleware';

export class ServiceBusProcessor<T = any> {
  private readonly logger: Logger;
  private receiver: ServiceBusReceiver;
  private subscription: { close(): Promise<void> };

  constructor(
    private readonly client: ServiceBusClient,
    private readonly administrationClient: ServiceBusAdministrationClient,
    private readonly emulated: boolean,
    private readonly queue: string,
    private readonly callback:
      | ((data: T) => Promise<void>)
      | ((data: T, message: ServiceBusMessage) => Promise<void>),
    private readonly DtoClass?: Type<T>,
    private readonly middlewares: Array<QueueMiddleware> = [],
  ) {
    this.logger = new Logger(`${ServiceBusProcessor.name} - ${this.queue}`);
  }

  async initialize() {
    try {
      this.logger.log(`Creating '${this.queue}' queue`);
      if (!this.emulated) await this.administrationClient.createQueue(this.queue);
    } catch (error) {
      if (error instanceof ServiceBusError && error.code === 'MessagingEntityAlreadyExists') {
        this.logger.log(`Skipping '${this.queue}' queue creation: Already exists`);
        return;
      }
    }
  }

  bind() {
    this.receiver = this.client.createReceiver(this.queue);
    this.subscription = this.receiver.subscribe({
      processError: async (error) => await this.error(error),
      processMessage: async (message) => await this.process(message),
    });
  }

  async close() {
    await this.subscription.close();
    await this.receiver.close();
  }

  private async process(message: ServiceBusMessage): Promise<void> {
    try {
      this.logger.log(
        `Processing message '${message.messageId?.toString() ?? ''}' from '${this.queue}' queue`,
      );
      await this.applyMiddlewares(async () => {
        const body: T = await VALIDATION_PIPE.transform(message.body, {
          type: 'body',
          metatype: this.DtoClass,
        });
        await this.callback(body, message);
      }, message);
      this.logger.log(
        `Processed message '${message.messageId?.toString() ?? ''}' from '${this.queue}' queue`,
      );
    } catch (error) {
      this.logger.error(
        `Error processing message '${message.messageId?.toString() ?? ''}' from '${this.queue}' queue`,
      );
      throw error;
    }
  }

  private async error({ error }: ProcessErrorArgs): Promise<void> {
    this.logger.error(`Error processing message from '${this.queue}' queue`);
    this.logger.error(error);
    await Promise.resolve();
  }

  private async applyMiddlewares<T>(callback: () => Promise<T>, message: ServiceBusMessage) {
    const composed = this.composeMiddlewares(this.middlewares, async () => await callback(), message);
    return await composed();
  }

  private composeMiddlewares<T>(
    middlewares: Array<QueueMiddleware>,
    callback: () => Promise<T>,
    message: ServiceBusMessage,
  ) {
    if (middlewares.length === 0) return async () => callback();
    else
      return async () =>
        await middlewares[0].use(
          this.queue,
          await this.composeMiddlewares(middlewares.slice(1), callback, message),
          message,
        );
  }
}
