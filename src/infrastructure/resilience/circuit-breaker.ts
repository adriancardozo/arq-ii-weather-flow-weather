export class CircuitBreakerOpenError extends Error {
  constructor(message = 'Circuit breaker is open') {
    super(message);
  }
}

type CircuitState = 'CLOSED' | 'OPEN' | 'HALF_OPEN';

export type CircuitBreakerOptions = {
  failureThreshold: number;
  resetTimeoutMs: number;
};

/*
1) First it's CLOSED (normal): allows requests to pass through.
If many consecutive failures occur (threshold), it transitions to OPEN: immediately rejects new calls.
After a reset timeout, it moves to HALF_OPEN: allows a single test request.
If the test succeeds, it returns to CLOSED.
If the test fails, it goes back to OPEN.
*/
export class CircuitBreaker {
  private state: CircuitState = 'CLOSED';
  private failures = 0;
  private openedAt = 0;
  // Allows only one probe request while the circuit is HALF_OPEN.
  private halfOpenInFlight = false;

  constructor(
    private readonly options: CircuitBreakerOptions,
    private readonly now: () => number = () => Date.now(),
  ) {}

  getState(): CircuitState {
    return this.state;
  }

  async execute<T>(action: () => Promise<T>): Promise<T> {
    // OPEN -> HALF_OPEN transition is time-based.
    this.evaluateState();

    if (this.state === 'OPEN') {
      throw new CircuitBreakerOpenError();
    }

    if (this.state === 'HALF_OPEN') {
      // In HALF_OPEN we permit a single probe request to test recovery.
      if (this.halfOpenInFlight) {
        throw new CircuitBreakerOpenError('Circuit breaker is half-open and probing');
      }
      this.halfOpenInFlight = true;
    }

    try {
      const result = await action();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private evaluateState(): void {
    if (this.state !== 'OPEN') return;

    const elapsed = this.now() - this.openedAt;
    // After reset timeout, move to HALF_OPEN and allow a probe.
    if (elapsed >= this.options.resetTimeoutMs) {
      this.state = 'HALF_OPEN';
      this.halfOpenInFlight = false;
    }
  }

  private onSuccess(): void {
    if (this.state === 'HALF_OPEN') {
      // Probe success closes the circuit and resets failure count.
      this.state = 'CLOSED';
      this.failures = 0;
      this.halfOpenInFlight = false;
      return;
    }

    this.failures = 0;
  }

  private onFailure(): void {
    if (this.state === 'HALF_OPEN') {
      // Probe failure immediately re-opens the circuit.
      this.trip();
      this.halfOpenInFlight = false;
      return;
    }

    this.failures += 1;
    if (this.failures >= this.options.failureThreshold) {
      this.trip();
    }
  }

  private trip(): void {
    // OPEN state: reject calls fast until reset timeout expires.
    this.state = 'OPEN';
    this.failures = 0;
    this.openedAt = this.now();
  }
}
