import { ApiProperty } from '@nestjs/swagger';
import { LocationResponse } from './location.response';
import { AverageMeasurement } from 'src/bussiness/aggregates/average-measurement.aggregate';

export class AverageTemperatureResponse {
  @ApiProperty()
  id: string;
  @ApiProperty()
  name: string;
  @ApiProperty({ type: LocationResponse })
  location: LocationResponse;
  @ApiProperty({ enum: ['day', 'week'] })
  period: 'day' | 'week';
  @ApiProperty()
  average_temperature: number;

  constructor({ station, averageTemperature, period }: AverageMeasurement) {
    this.id = station.id!;
    this.name = station.name;
    this.location = new LocationResponse(station.location);
    this.period = period;
    this.average_temperature = averageTemperature;
  }
}
