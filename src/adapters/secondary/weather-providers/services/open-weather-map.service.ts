import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { RegisterMeasurementInput } from 'src/bussiness/ports/input/services/dtos/input/register-measurement.input';
import { IWeatherProviderService } from 'src/bussiness/ports/output/services/i-weather-provider.service';
import { Location } from 'src/bussiness/value-objects/location.value-object';
import { Configuration } from 'src/infrastructure/configuration/configuration';
import { OpenWeatherMapMeasurement } from '../types/open-weather-map-measurement.type';

@Injectable()
export class OpenWeatherMapService implements IWeatherProviderService {
  private readonly url: string;
  private readonly apiKey: string;
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    const { url: baseUrl, api_key } =
      this.configService.get<Configuration['open_weather_map']>('open_weather_map')!;
    this.url = `${baseUrl}/weather`;
    this.apiKey = api_key;
  }

  async measure(station: string, location: Location): Promise<RegisterMeasurementInput> {
    const result = this.httpService.get<OpenWeatherMapMeasurement>(
      `${this.url}?lat=${location.latitude}&lon=${location.longitude}&units=metric&appid=${this.apiKey}`,
    );
    const { data } = await firstValueFrom(result);
    const { pressure, temp: temperature, humidity } = data.main;
    return new RegisterMeasurementInput(pressure, temperature, humidity, station);
  }
}
