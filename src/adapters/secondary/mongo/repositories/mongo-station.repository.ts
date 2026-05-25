import { IStationRepository } from 'src/bussiness/ports/output/repositories/i-station.repository';
import { MongoRepository } from './mongo.repository';
import { CreateStationInput } from 'src/bussiness/ports/input/services/dtos/input/create-station.input';
import { EditStationInput } from 'src/bussiness/ports/input/services/dtos/input/edit-station.input';
import { Station } from 'src/bussiness/entities/station.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MongoTransactionService } from '../services/mongo-transaction.service';
import { StationNotFoundError } from 'src/bussiness/errors/station-not-found.error';
import { Station as StationObject } from '../schemas/object/station-object.schema';

export class MongoStationRepository
  extends MongoRepository<Station, CreateStationInput, EditStationInput>
  implements IStationRepository
{
  constructor(
    @InjectModel(Station.name) StationModel: Model<Station>,
    transactionService: MongoTransactionService,
  ) {
    super(StationObject, Station, StationNotFoundError, StationModel, transactionService, [
      'owner',
      'subscribers',
      'measurements',
    ]);
  }
}
