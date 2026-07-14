import { Injectable, NestMiddleware } from '@nestjs/common';
import { trace, Tracer } from '@opentelemetry/api';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class TracesMiddleware implements NestMiddleware {
  private readonly tracer: Tracer = trace.getTracer('api');

  use(req: Request, res: Response, next: NextFunction) {
    this.tracer.startActiveSpan(req.baseUrl, (span) => {
      next();
      span.end();
    });
  }
}
