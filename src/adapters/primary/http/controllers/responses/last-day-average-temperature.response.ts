import { ApiProperty } from '@nestjs/swagger';

export class LastDayAverageTemperatureResponse {
  @ApiProperty()
  station_id: string;

  @ApiProperty()
  average_temperature: number;

  constructor(stationId: string, averageTemperature: number) {
    this.station_id = stationId;
    this.average_temperature = averageTemperature;
  }
}
