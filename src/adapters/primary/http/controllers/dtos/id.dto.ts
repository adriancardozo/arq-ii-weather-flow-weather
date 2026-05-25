import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class IdDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  id: string;
}
