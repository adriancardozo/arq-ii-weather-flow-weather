import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { RegisterMeasurementInput } from 'src/bussiness/ports/input/services/dtos/input/register-measurement.input';

export class CreateMeasurementDto {
  @ApiProperty({ type: 'number' })
  @IsNotEmpty()
  @IsNumber()
  pressure: number;
  @ApiProperty({ type: 'number' })
  @IsNotEmpty()
  @IsNumber()
  temperature: number;
  @ApiProperty({ type: 'number' })
  @IsNotEmpty()
  @IsNumber()
  humidity: number;
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  station_id: string;

  toInput(): RegisterMeasurementInput {
    return new RegisterMeasurementInput(this.pressure, this.temperature, this.humidity, this.station_id);
  }
}
