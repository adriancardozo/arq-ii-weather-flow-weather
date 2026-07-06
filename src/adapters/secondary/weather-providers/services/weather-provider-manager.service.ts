import { Injectable } from '@nestjs/common';
import { IWeatherProviderManagerService } from 'src/bussiness/ports/output/services/i-weather-provider-manager.service';
import { IWeatherProviderService } from 'src/bussiness/ports/output/services/i-weather-provider.service';
import { OpenWeatherMapService } from './open-weather-map.service';

@Injectable()
export class WeatherProviderManagerService implements IWeatherProviderManagerService {
  private readonly providers: Record<'OpenWeatherMap', IWeatherProviderService>;

  constructor(private readonly openWeatherMapService: OpenWeatherMapService) {
    this.providers = { OpenWeatherMap: this.openWeatherMapService };
  }

  getProviderService(provider: 'OpenWeatherMap'): IWeatherProviderService {
    return this.providers[provider];
  }
}
