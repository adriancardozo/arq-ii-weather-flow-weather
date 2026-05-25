import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, IsStrongPassword } from 'class-validator';
import { CreateUserInput } from 'src/bussiness/ports/input/services/dtos/input/create-user.input';

export class CreateUserDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  first_name: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  last_name: string;
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  @IsString()
  email: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsStrongPassword()
  password: string;

  toInput(): CreateUserInput {
    return new CreateUserInput(this.first_name, this.last_name, this.email, this.password);
  }
}
