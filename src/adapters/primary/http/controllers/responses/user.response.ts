import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/bussiness/entities/user.entity';

export class UserResponse {
  @ApiProperty()
  id: string;
  @ApiProperty()
  first_name: string;
  @ApiProperty()
  last_name: string;
  @ApiProperty()
  email: string;
  @ApiProperty({ type: 'string', isArray: true })
  stations: Array<string | null>;

  constructor(user: User) {
    this.id = user.id!;
    this.first_name = user.firstName;
    this.last_name = user.lastName;
    this.email = user.email;
    this.stations = user.stations?.map((station) => station.id) ?? null;
  }
}
