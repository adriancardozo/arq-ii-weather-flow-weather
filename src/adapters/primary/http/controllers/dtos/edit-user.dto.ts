import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';
import { EditUserInput } from 'src/bussiness/ports/input/services/dtos/input/edit-user.input';

export class EditUserDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  first_name?: string;
  @ApiProperty()
  @IsOptional()
  @IsString()
  last_name?: string;
  @ApiProperty()
  @IsEmail()
  @IsOptional()
  @IsString()
  email?: string;

  toInput(): EditUserInput {
    return new EditUserInput(this.first_name, this.last_name, this.email);
  }
}
