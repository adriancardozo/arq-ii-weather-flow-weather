import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { Connection } from 'mongoose';
import { CurrentTemperatureNotFoundError } from 'src/bussiness/errors/current-temperature-not-found.error';
import { LastDayAverageTemperatureNotFoundError } from 'src/bussiness/errors/last-day-average-temperature-not-found.error';
import { ICurrentTemperatureService } from 'src/bussiness/ports/output/services/i-current-temperature.service';

type ObservationDocument = {
  observations?: Array<{ temp?: number; datetime?: Date | string }>;
};

@Injectable()
export class CurrentTemperatureService implements ICurrentTemperatureService {
  private readonly dbName: string;
  private readonly collectionName: string;

  constructor(
    @InjectConnection() private readonly connection: Connection,
    private readonly configService: ConfigService,
  ) {
    this.dbName = this.configService.get<string>('weather.db') ?? 'weather-flow-db';
    this.collectionName = this.configService.get<string>('weather.collection') ?? 'weather';
  }

  async getCurrentByCoordinates(latitude: number, longitude: number): Promise<number> {
    const weatherDb = this.connection.useDb(this.dbName, { useCache: true });
    const weatherCollection = weatherDb.collection<ObservationDocument>(this.collectionName);

    const [result] = await weatherCollection
      .aggregate<{ temp?: number }>([
        {
          $match: {
            latitude,
            longitude,
          },
        },
        { $unwind: '$observations' },
        {
          $sort: {
            'observations.datetime': -1,
            _id: -1,
          },
        },
        { $limit: 1 },
        {
          $project: {
            _id: 0,
            temp: '$observations.temp',
          },
        },
      ])
      .toArray();

    if (typeof result?.temp !== 'number') {
      throw new CurrentTemperatureNotFoundError(latitude, longitude);
    }

    return result.temp;
  }

  async getLastDayAverageByCoordinates(latitude: number, longitude: number): Promise<number> {
    const weatherDb = this.connection.useDb(this.dbName, { useCache: true });
    const weatherCollection = weatherDb.collection<ObservationDocument>(this.collectionName);
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const [result] = await weatherCollection
      .aggregate<{ average_temp?: number }>([
        {
          $match: {
            latitude,
            longitude,
          },
        },
        { $unwind: '$observations' },
        {
          $addFields: {
            observation_date: { $toDate: '$observations.datetime' },
          },
        },
        {
          $match: {
            observation_date: { $gte: oneDayAgo },
            'observations.temp': { $type: 'number' },
          },
        },
        {
          $group: {
            _id: null,
            average_temp: { $avg: '$observations.temp' },
          },
        },
        {
          $project: {
            _id: 0,
            average_temp: 1,
          },
        },
      ])
      .toArray();

    if (typeof result?.average_temp !== 'number') {
      throw new LastDayAverageTemperatureNotFoundError(latitude, longitude);
    }

    return result.average_temp;
  }
}
