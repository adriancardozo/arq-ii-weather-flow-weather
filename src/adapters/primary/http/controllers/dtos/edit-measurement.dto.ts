import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { EditMeasurementInput } from 'src/bussiness/ports/input/services/dtos/input/edit-measurement.input';

export class EditMeasurementDto {
  @ApiProperty({ type: 'number' })
  @IsOptional()
  @IsNumber()
  pressure?: number;
  @ApiProperty({ type: 'number' })
  @IsOptional()
  @IsNumber()
  temperature?: number;
  @ApiProperty({ type: 'number' })
  @IsOptional()
  @IsNumber()
  humidity?: number;
  @ApiProperty()
  @IsOptional()
  @IsString()
  station_id?: string;

  toInput(): EditMeasurementInput {
    return new EditMeasurementInput(this.pressure, this.temperature, this.humidity, this.station_id);
  }
}
