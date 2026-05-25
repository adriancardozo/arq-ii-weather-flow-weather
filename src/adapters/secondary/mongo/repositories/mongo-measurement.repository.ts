import { IMeasurementRepository } from 'src/bussiness/ports/output/repositories/i-measurement.repository';
import { MongoRepository } from './mongo.repository';
import { Measurement } from 'src/bussiness/entities/measurement.entity';
import { RegisterMeasurementInput } from 'src/bussiness/ports/input/services/dtos/input/register-measurement.input';
import { EditMeasurementInput } from 'src/bussiness/ports/input/services/dtos/input/edit-measurement.input';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MongoTransactionService } from '../services/mongo-transaction.service';
import { MeasurementNotFoundError } from 'src/bussiness/errors/measurement-not-found.error';
import { Measurement as MeasurementObject } from '../schemas/object/measurement-object.schema';

export class MongoMeasurementRepository
  extends MongoRepository<Measurement, Measurement | RegisterMeasurementInput, EditMeasurementInput>
  implements IMeasurementRepository
{
  constructor(
    @InjectModel(Measurement.name) MeasurementModel: Model<Measurement>,
    transactionService: MongoTransactionService,
  ) {
    super(MeasurementObject, Measurement, MeasurementNotFoundError, MeasurementModel, transactionService, [
      'station',
    ]);
  }
}
