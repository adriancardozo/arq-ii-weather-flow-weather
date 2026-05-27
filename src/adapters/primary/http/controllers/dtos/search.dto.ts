import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsDate, IsNumber, IsOptional, IsString } from 'class-validator';
import { SearchInput } from 'src/bussiness/ports/input/services/dtos/input/search.input';

export class SearchDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  station: string;
  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  min_temperature?: number;
  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  max_temperature?: number;
  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  min_pressure?: number;
  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  max_pressure?: number;
  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  min_humidity?: number;
  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  max_humidity?: number;
  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  active?: boolean;
  @ApiProperty({ required: false, default: 120, description: '(minutes)' })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  active_range: number = 120;
  @ApiProperty({ required: false })
  @Transform(({ value }) => (value ? new Date(value) : undefined))
  @IsOptional()
  @IsDate()
  from_date?: Date;
  @ApiProperty({ required: false })
  @Transform(({ value }) => (value ? new Date(value) : undefined))
  @IsOptional()
  @IsDate()
  to_date?: Date;

  toInput(): SearchInput {
    return new SearchInput(
      this.station,
      this.active_range * 60 * 1000,
      this.min_temperature,
      this.max_temperature,
      this.min_pressure,
      this.max_pressure,
      this.min_humidity,
      this.max_humidity,
      this.active,
      this.from_date,
      this.to_date,
    );
  }
}
