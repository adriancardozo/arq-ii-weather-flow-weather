import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model } from 'mongoose';
import { User } from 'src/bussiness/entities/user.entity';
import { UserAlreadyExistsError } from 'src/bussiness/errors/user-already-exists.error';
import { CreateUserInput } from 'src/bussiness/ports/input/services/dtos/input/create-user.input';
import { IUserRepository } from 'src/bussiness/ports/output/repositories/i-user.repository';
import { MongoTransactionService } from '../services/mongo-transaction.service';
import { UserNotFoundError } from 'src/bussiness/errors/user-not-found.error';
import { MongoRepository } from './mongo.repository';
import { EditUserInput } from 'src/bussiness/ports/input/services/dtos/input/edit-user.input';
import { User as UserObject } from '../schemas/object/user-object.schema';

export class MongoUserRepository
  extends MongoRepository<User, CreateUserInput, EditUserInput>
  implements IUserRepository<ClientSession>
{
  constructor(@InjectModel(User.name) UserModel: Model<User>, transactionService: MongoTransactionService) {
    super(
      UserObject,
      User,
      UserNotFoundError,
      UserModel,
      transactionService,
      ['stations', 'subscriptions', 'alerts'],
      UserAlreadyExistsError,
    );
  }
}
