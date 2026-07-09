import { CreateSubscriberDto } from './create-subscriber.dto';
import { DeleteSubscriberDto } from './delete-subscriber.dto';
import { EditSubscriberDto } from './edit-subscriber.dto';

export class SubscriberDto {
  constructor(
    public type: 'create' | 'edit' | 'delete',
    public create_dto?: CreateSubscriberDto,
    public edit_dto?: EditSubscriberDto,
    public delete_dto?: DeleteSubscriberDto,
  ) {}
}
