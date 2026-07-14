import { Injectable } from '@nestjs/common';
import { context, propagation, ROOT_CONTEXT, trace, Tracer } from '@opentelemetry/api';
import { QueueMiddleware } from './queue.middleware';
import { ServiceBusMessage } from '@azure/service-bus';

@Injectable()
export class QueueTracesMiddleware implements QueueMiddleware {
  private readonly tracer: Tracer = trace.getTracer('azure_service_bus');

  async use<T>(queue: string, callback: () => Promise<T>, message: ServiceBusMessage) {
    const process = async () => {
      return await this.tracer.startActiveSpan(`queue:${queue}`, async (span) => {
        const result = await callback();
        span.end();
        return result;
      });
    };
    if (message.applicationProperties) {
      const parentContext = propagation.extract(ROOT_CONTEXT, message.applicationProperties);
      return await context.with(parentContext, async () => await process());
    } else {
      return await process();
    }
  }
}
