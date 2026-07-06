import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { CreateStationInput } from 'src/bussiness/ports/input/services/dtos/input/create-station.input';
import { Location } from 'src/bussiness/value-objects/location.value-object';

export class CreateStationDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;
  @ApiProperty({ type: 'number' })
  @IsNotEmpty()
  @IsNumber()
  longitude: number;
  @ApiProperty({ type: 'number' })
  @IsNotEmpty()
  @IsNumber()
  latitude: number;
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  sensor_model: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  owner_id: string;
  @ApiProperty({ default: null, nullable: true, required: false })
  @IsOptional()
  @IsString()
  provider: string | null = null;

  toInput(): CreateStationInput {
    return new CreateStationInput(
      this.name,
      new Location([this.longitude, this.latitude]),
      this.sensor_model,
      this.owner_id,
      this.provider,
    );
  }
}
