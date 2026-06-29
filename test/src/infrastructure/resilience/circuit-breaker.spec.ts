import { CircuitBreaker, CircuitBreakerOpenError } from 'src/infrastructure/resilience/circuit-breaker';

describe('CircuitBreaker', () => {
  it('should keep circuit closed when calls succeed', async () => {
    const breaker = new CircuitBreaker({ failureThreshold: 2, resetTimeoutMs: 1000 });

    const result = await breaker.execute(() => Promise.resolve('ok'));

    expect(result).toEqual('ok');
    expect(breaker.getState()).toEqual('CLOSED');
  });

  it('should open circuit after reaching failure threshold', async () => {
    const breaker = new CircuitBreaker({ failureThreshold: 2, resetTimeoutMs: 1000 });

    await expect(breaker.execute(() => Promise.reject(new Error('boom-1')))).rejects.toThrow('boom-1');
    await expect(breaker.execute(() => Promise.reject(new Error('boom-2')))).rejects.toThrow('boom-2');

    expect(breaker.getState()).toEqual('OPEN');
    await expect(breaker.execute(() => Promise.resolve('should-not-run'))).rejects.toBeInstanceOf(
      CircuitBreakerOpenError,
    );
  });

  it('should transition to half-open after reset timeout and close on success', async () => {
    let now = 0;
    const breaker = new CircuitBreaker({ failureThreshold: 1, resetTimeoutMs: 100 }, () => now);

    await expect(breaker.execute(() => Promise.reject(new Error('fail')))).rejects.toThrow('fail');
    expect(breaker.getState()).toEqual('OPEN');

    await expect(breaker.execute(() => Promise.resolve('nope'))).rejects.toBeInstanceOf(
      CircuitBreakerOpenError,
    );

    now = 150;

    const result = await breaker.execute(() => Promise.resolve('recovered'));

    expect(result).toEqual('recovered');
    expect(breaker.getState()).toEqual('CLOSED');
  });
});
