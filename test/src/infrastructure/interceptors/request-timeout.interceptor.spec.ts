import { RequestTimeoutException } from '@nestjs/common';
import { lastValueFrom, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { RequestTimeoutInterceptor } from 'src/infrastructure/interceptors/request-timeout.interceptor';

describe('RequestTimeoutInterceptor', () => {
  const createInterceptor = (timeoutMs: number) => {
    const configService = {
      get: jest.fn().mockReturnValue(timeoutMs),
    } as any;

    return new RequestTimeoutInterceptor(configService);
  };

  it('should return response when execution finishes before timeout', async () => {
    const interceptor = createInterceptor(50);

    const callHandler = {
      handle: () => of('ok').pipe(delay(5)),
    } as any;

    const result = await lastValueFrom(interceptor.intercept({} as any, callHandler));

    expect(result).toEqual('ok');
  });

  it('should throw RequestTimeoutException when execution exceeds timeout', async () => {
    const interceptor = createInterceptor(5);

    const callHandler = {
      handle: () => of('late').pipe(delay(30)),
    } as any;

    const result = lastValueFrom(interceptor.intercept({} as any, callHandler));

    await expect(result).rejects.toBeInstanceOf(RequestTimeoutException);
  });
});
