import { of, throwError } from 'rxjs';
import { UserStationService } from 'src/adapters/secondary/users/services/user-station.service';

describe('UserStationService fallbacks', () => {
  const createService = (fallbackEnabled: boolean, shouldFail = false) => {
    const httpService = {
      put: jest.fn().mockImplementation(() => {
        if (shouldFail) return throwError(() => new Error('users unavailable'));
        return of({ data: {} });
      }),
    } as any;

    const configValues: Record<string, any> = {
      'users.url': 'http://users-ms:3000',
      'users.timeout_ms': 1200,
      'users.fallback_enabled': fallbackEnabled,
      'users.circuit_breaker.failure_threshold': 3,
      'users.circuit_breaker.reset_timeout_ms': 10000,
    };

    const configService = {
      get: jest.fn().mockImplementation((key: string) => configValues[key]),
    } as any;

    return {
      service: new UserStationService(httpService, configService),
      httpService,
    };
  };

  it('should continue execution when users call fails and fallback is enabled', async () => {
    const { service } = createService(true, true);

    await expect(service.addSubscription('user-1', 'station-1')).resolves.toBeUndefined();
  });

  it('should propagate error when users call fails and fallback is disabled', async () => {
    const { service } = createService(false, true);

    await expect(service.addSubscription('user-1', 'station-1')).rejects.toThrow('users unavailable');
  });

  it('should call users endpoint on updateOwner', async () => {
    const { service, httpService } = createService(true, false);

    await service.updateOwner('station-1', null, 'owner-1');

    expect(httpService.put).toHaveBeenCalledWith(
      'http://users-ms:3000/user-station/station-1/update-owner?new_id=owner-1',
    );
  });
});
