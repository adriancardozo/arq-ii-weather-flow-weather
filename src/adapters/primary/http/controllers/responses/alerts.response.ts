import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/bussiness/entities/user.entity';
import { AlertResponse } from './alert.response';

export class AlertsResponse {
  @ApiProperty()
  id: string;
  @ApiProperty({ type: AlertResponse, isArray: true })
  alerts: Array<AlertResponse>;

  constructor(user: User) {
    this.id = user.id!;
    this.alerts = user.alerts?.map((alert) => new AlertResponse(alert));
  }
}
