import { ApiProperty } from '@nestjs/swagger';

export class CurrentTemperatureResponse {
  @ApiProperty()
  station_id: string;

  @ApiProperty()
  temperature: number;

  constructor(stationId: string, temperature: number) {
    this.station_id = stationId;
    this.temperature = temperature;
  }
}
