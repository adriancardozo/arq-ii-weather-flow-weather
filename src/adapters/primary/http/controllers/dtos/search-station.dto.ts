import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsDate, IsNumber, IsOptional, IsString } from 'class-validator';
import { SearchStationInput } from 'src/bussiness/ports/input/services/dtos/input/search-station.input';

export class SearchStationDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  station: string = '';

  toInput(): SearchStationInput {
    return new SearchStationInput(this.station);
  }
}
