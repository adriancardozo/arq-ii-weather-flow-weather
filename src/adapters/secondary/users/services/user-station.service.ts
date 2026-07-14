import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { IUserStationService } from 'src/bussiness/ports/output/services/i-user-station.service';
import { Configuration } from 'src/infrastructure/configuration/configuration';

@Injectable()
export class UserStationService implements IUserStationService {
  private readonly url: string;
  private readonly timeout: Configuration['timeout'];

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    const baseUrl = this.configService.get('users.url')!;
    this.url = `${baseUrl}/user-station`;
    this.timeout = this.configService.get<Configuration['timeout']>('timeout')!;
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
    const result = this.httpService.put(`${this.url}/${stationId}/update-owner${query}`, undefined, {
      timeout: this.timeout.users_timeout,
    });
    await firstValueFrom(result);
  }

  async addSubscription(userId: string, stationId: string | null): Promise<void> {
    const result = this.httpService.put(`${this.url}/${stationId}/subscribe/${userId}`, {
      timeout: this.timeout.users_timeout,
    });
    await firstValueFrom(result);
  }
}
