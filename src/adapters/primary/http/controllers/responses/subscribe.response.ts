import { ApiProperty } from '@nestjs/swagger';
import { Station } from 'src/bussiness/entities/station.entity';

export class SubscribeResponse {
  @ApiProperty()
  message = 'subscribed' as const;

  constructor(station: Station) {}
}
