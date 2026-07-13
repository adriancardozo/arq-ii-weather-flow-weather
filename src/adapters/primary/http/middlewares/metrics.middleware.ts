import { Injectable, NestMiddleware } from '@nestjs/common';
import { Meter, metrics } from '@opentelemetry/api';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class MetricsMiddleware implements NestMiddleware {
  private readonly meter: Meter = metrics.getMeter('api');
  private readonly counter = this.meter.createCounter('request_counter');
  private readonly histogram = this.meter.createHistogram('request_duration');
  private readonly gauge = this.meter.createGauge('response_time');

  use(req: Request, res: Response, next: NextFunction) {
    const start = new Date().getTime();
    res.on('finish', () => {
      const end = new Date().getTime();
      this.counter.add(1, { path: req.route.path, method: req.method, status: res.statusCode });
      this.histogram.record(end - start, {
        path: req.route.path,
        method: req.method,
        status: res.statusCode,
      });
      this.gauge.record(end - start, { path: req.route.path, method: req.method, status: res.statusCode });
    });
    next();
  }
}
