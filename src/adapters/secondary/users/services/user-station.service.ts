import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom, timeout } from 'rxjs';
import { IUserStationService } from 'src/bussiness/ports/output/services/i-user-station.service';
import { CircuitBreaker } from 'src/infrastructure/resilience/circuit-breaker';

@Injectable()
export class UserStationService implements IUserStationService {
  private readonly url: string;
  private readonly timeoutMs: number;
  private readonly circuitBreaker: CircuitBreaker;
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    const baseUrl = this.configService.get('users.url')!;
    this.url = `${baseUrl}/user-station`;
    this.timeoutMs = this.configService.get<number>('users.timeout_ms') ?? 1200;
    const failureThreshold = this.configService.get<number>('users.circuit_breaker.failure_threshold') ?? 3;
    const resetTimeoutMs =
      this.configService.get<number>('users.circuit_breaker.reset_timeout_ms') ?? 10000;
    this.circuitBreaker = new CircuitBreaker({ failureThreshold, resetTimeoutMs });
  }

  async updateOwner(
    stationId: string | null,
    oldOwner: string | null,
    owner: string | null,
  ): Promise<void> {
    let query = '';
    if (oldOwner && owner) query = `?old_id=${oldOwner}&new_id=${owner}`;
    else if (oldOwner) query = `?old_id=${oldOwner}`;
    else if (owner) query = `?new_id=${owner}`;
    await this.circuitBreaker.execute(async () => {
      const result = this.httpService
        .put(`${this.url}/${stationId}/update-owner${query}`)
        .pipe(timeout(this.timeoutMs));
      await firstValueFrom(result);
    });
  }

  async addSubscription(userId: string, stationId: string | null): Promise<void> {
    await this.circuitBreaker.execute(async () => {
      const result = this.httpService
        .put(`${this.url}/${stationId}/subscribe/${userId}`)
        .pipe(timeout(this.timeoutMs));
      await firstValueFrom(result);
    });
  }
}
