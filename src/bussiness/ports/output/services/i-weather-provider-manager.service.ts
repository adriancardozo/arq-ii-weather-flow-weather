import { IWeatherProviderService } from './i-weather-provider.service';

export abstract class IWeatherProviderManagerService {
  abstract getProviderService(provider: string): IWeatherProviderService;
}
