import { ApiProperty } from '@nestjs/swagger';
import { LocationResponse } from './location.response';
import { Measurement } from 'src/bussiness/entities/measurement.entity';

export class StationTemperatureResponse {
  @ApiProperty()
  id: string;
  @ApiProperty()
  name: string;
  @ApiProperty({ type: LocationResponse })
  location: LocationResponse;
  @ApiProperty()
  current_temperature: number;

  constructor({ station, temperature }: Measurement) {
    this.id = station.id!;
    this.name = station.name;
    this.location = new LocationResponse(station.location);
    this.current_temperature = temperature;
  }
}
