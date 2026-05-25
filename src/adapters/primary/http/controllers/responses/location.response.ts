import { ApiProperty } from '@nestjs/swagger';
import type { Latitude, Location, Longitude } from 'src/bussiness/value-objects/location.value-object';

export class LocationResponse {
  @ApiProperty({ type: 'number' })
  longitude: Longitude;
  @ApiProperty({ type: 'number' })
  latitude: Latitude;

  constructor(location: Location) {
    this.longitude = location.coordinates[0];
    this.latitude = location.coordinates[1];
  }
}
