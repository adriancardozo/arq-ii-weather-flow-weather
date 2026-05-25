import { ApiProperty } from '@nestjs/swagger';
import { Measurement } from 'src/bussiness/entities/measurement.entity';

export class AlertResponse {
  @ApiProperty()
  id: string;
  @ApiProperty()
  datetime: string;
  @ApiProperty()
  alert: boolean;
  @ApiProperty({ enum: ['Ninguna', 'Calor extremo', 'Helada', 'Tormenta', 'Humedad crítica'] })
  alert_type: 'Ninguna' | 'Calor extremo' | 'Helada' | 'Tormenta' | 'Humedad crítica';
  @ApiProperty()
  pressure: number;
  @ApiProperty()
  temperature: number;
  @ApiProperty()
  humidity: number;

  constructor(measurement: Measurement) {
    this.id = measurement.id!;
    this.datetime = measurement.datetime.toISOString();
    this.alert = measurement.alert;
    this.alert_type = measurement.alertType;
    this.pressure = measurement.pressure;
    this.temperature = measurement.temperature;
    this.humidity = measurement.humidity;
  }
}
