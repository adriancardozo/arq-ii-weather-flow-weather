import { ApiProperty } from '@nestjs/swagger';
import { Station } from 'src/bussiness/entities/station.entity';
import { LocationResponse } from './location.response';

export class StationResponse {
  @ApiProperty()
  id: string;
  @ApiProperty()
  name: string;
  @ApiProperty({ type: LocationResponse })
  location: LocationResponse;
  @ApiProperty()
  sensor_model: string;
  @ApiProperty()
  state: 'active' | 'inactive';
  @ApiProperty()
  owner_id: string | null;

  constructor(station: Station) {
    this.id = station.id!;
    this.name = station.name;
    this.location = new LocationResponse(station.location);
    this.sensor_model = station.sensorModel;
    this.state = station.state;
    this.owner_id = station.owner?.id ?? null;
  }
}
