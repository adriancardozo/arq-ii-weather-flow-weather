import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNumber, IsOptional, IsString } from 'class-validator';
import { EditStationInput } from 'src/bussiness/ports/input/services/dtos/input/edit-station.input';

export class EditStationDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  name?: string;
  @ApiProperty({ type: 'number' })
  @IsOptional()
  @IsNumber()
  longitude?: number;
  @ApiProperty({ type: 'number' })
  @IsOptional()
  @IsNumber()
  latitude?: number;
  @ApiProperty()
  @IsOptional()
  @IsString()
  sensor_model?: string;
  @ApiProperty({ enum: ['active', 'inactive'] })
  @IsOptional()
  @IsIn(['active', 'inactive'])
  state?: 'active' | 'inactive';
  @ApiProperty()
  @IsOptional()
  @IsString()
  owner_id?: string;

  toInput(): EditStationInput {
    return new EditStationInput(
      this.name,
      this.longitude,
      this.latitude,
      this.sensor_model,
      this.state,
      this.owner_id,
    );
  }
}
