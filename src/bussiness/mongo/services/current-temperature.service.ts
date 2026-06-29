import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { Connection } from 'mongoose';
import { CurrentTemperatureNotFoundError } from 'src/bussiness/errors/current-temperature-not-found.error';
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
}
