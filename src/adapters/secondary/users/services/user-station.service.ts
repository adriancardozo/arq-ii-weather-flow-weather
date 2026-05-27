import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { IUserStationService } from 'src/bussiness/ports/output/services/i-user-station.service';

@Injectable()
export class UserStationService implements IUserStationService {
  private readonly url: string;
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    const baseUrl = this.configService.get('users.url')!;
    this.url = `${baseUrl}/user-station`;
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
    const result = this.httpService.put(`${this.url}/${stationId}/update-owner${query}`);
    await firstValueFrom(result);
  }

  async addSubscription(userId: string, stationId: string | null): Promise<void> {
    const result = this.httpService.put(`${this.url}/${stationId}/subscribe/${userId}`);
    await firstValueFrom(result);
  }
}
