import { ServiceBusMessage } from '@azure/service-bus';

export abstract class QueueMiddleware {
  abstract use<T>(queue: string, callback: () => Promise<T>, message: ServiceBusMessage): Promise<T>;
}
