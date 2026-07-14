import { Injectable } from '@nestjs/common';
import { Meter, metrics } from '@opentelemetry/api';

@Injectable()
export class QueueMetricsMiddleware {
  private readonly meter: Meter = metrics.getMeter('azure_service_bus');
  private readonly counter = this.meter.createCounter('messaging.client.messages_total');
  private readonly histogram = this.meter.createHistogram('messaging.client.operation.duration');

  async use<T>(queue: string, callback: () => Promise<T>) {
    const start = new Date().getTime();
    const succededAttributes = {
      queue,
      'messaging.system': 'azure_service_bus',
      'messaging.destination.name': queue,
      'messaging.operation.type': 'process',
      status: 'success',
      'error.type': 'none',
    };
    try {
      const result = await callback();
      const end = new Date().getTime();
      this.counter.add(1, succededAttributes);
      this.histogram.record(end - start, succededAttributes);
      return result;
    } catch (error: any) {
      const end = new Date().getTime();
      const errorType = error?.name ?? 'ProcessingError';
      const errorAttributes = { ...succededAttributes, status: 'error', 'error.type': errorType };
      this.counter.add(1, errorAttributes);
      this.histogram.record(end - start, errorAttributes);
      throw error;
    }
  }
}
