import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Measurement } from 'src/bussiness/entities/measurement.entity';
import { Station } from 'src/bussiness/entities/station.entity';
import { IWeatherProviderService } from 'src/bussiness/ports/output/services/i-weather-provider.service';
import { Configuration } from 'src/infrastructure/configuration/configuration';
import { OpenWeatherMapMeasurement } from './types/open-weather-map-measurement.type';
import { firstValueFrom } from 'rxjs';
import { Injectable } from '@nestjs/common';

@Injectable()
export class OpenWeatherMapProviderService implements IWeatherProviderService {
  private readonly url: string;
  private readonly apiKey: string;
  private readonly timeout: Configuration['timeout'];

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    const { url: baseUrl, api_key } =
      this.configService.get<Configuration['open_weather_map']>('open_weather_map')!;
    this.timeout = this.configService.get<Configuration['timeout']>('timeout')!;
    this.url = `${baseUrl}/weather`;
    this.apiKey = api_key;
  }

  async measure(station: Station): Promise<Measurement> {
    const { location } = station;
    const result = this.httpService.get<OpenWeatherMapMeasurement>(
      `${this.url}?lat=${location.latitude}&lon=${location.longitude}&units=metric&appid=${this.apiKey}`,
      { timeout: this.timeout.open_weather_map },
    );
    const { data } = await firstValueFrom(result);
    const { pressure, temp: temperature, humidity } = data.main;
    return new Measurement(undefined, pressure, temperature, humidity, station, new Date());
  }
}
