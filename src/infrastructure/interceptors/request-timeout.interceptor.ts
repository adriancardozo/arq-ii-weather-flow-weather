import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  RequestTimeoutException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Observable, TimeoutError, catchError, throwError, timeout } from 'rxjs';

@Injectable()
export class RequestTimeoutInterceptor implements NestInterceptor {
  private readonly timeoutMs: number;

  constructor(private readonly configService: ConfigService) {
    this.timeoutMs = this.configService.get<number>('app.request_timeout_ms') ?? 1500;
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      timeout(this.timeoutMs),
      catchError((error) => {
        if (error instanceof TimeoutError) {
          return throwError(
            () => new RequestTimeoutException(`Request timed out after ${this.timeoutMs} ms`),
          );
        }
        return throwError(() => error);
      }),
    );
  }
}
