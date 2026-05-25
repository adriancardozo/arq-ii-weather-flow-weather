import { Logger, Module } from '@nestjs/common';
import { AppController } from './adapters/primary/http/controllers/app.controller';
import { IUserService } from './bussiness/ports/input/services/i-user.service';
import { IStationService } from './bussiness/ports/input/services/i-station.service';
import { IMeasurementService } from './bussiness/ports/input/services/i-measurement.service';
import { MongoMeasurementRepository } from './adapters/secondary/mongo/repositories/mongo-measurement.repository';
import { MongoStationRepository } from './adapters/secondary/mongo/repositories/mongo-station.repository';
import { MongoUserRepository } from './adapters/secondary/mongo/repositories/mongo-user.repository';
import { IMeasurementRepository } from './bussiness/ports/output/repositories/i-measurement.repository';
import { IStationRepository } from './bussiness/ports/output/repositories/i-station.repository';
import { IUserRepository } from './bussiness/ports/output/repositories/i-user.repository';
import { MeasurementService } from './bussiness/services/measurement.service';
import { StationService } from './bussiness/services/station.service';
import { UserService } from './bussiness/services/user.service';
import { AuthController } from './adapters/primary/http/controllers/auth.controller';
import { MeasurementController } from './adapters/primary/http/controllers/measurement.controller';
import { StationController } from './adapters/primary/http/controllers/station.controller';
import { ConfigModule } from '@nestjs/config';
import configuration from './infrastructure/configuration/configuration';
import { MongooseModule } from '@nestjs/mongoose';
import { User } from './bussiness/entities/user.entity';
import { UserSchema } from './adapters/secondary/mongo/schemas/document/user.schema';
import { AuthService } from './bussiness/services/auth.service';
import { IAuthService } from './bussiness/ports/input/services/i-auth.service';
import { JwtModule } from '@nestjs/jwt';
import { BcryptHashService } from './adapters/secondary/bcrypt/services/bcrypt-hash.service';
import { IHashService } from './bussiness/ports/output/services/i-hash.service';
import { MongoTransactionService } from './adapters/secondary/mongo/services/mongo-transaction.service';
import { ITransactionService } from './bussiness/ports/output/services/i-transaction.service';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './adapters/primary/http/controllers/strategies/local.strategy';
import { JwtStrategy } from './adapters/primary/http/controllers/strategies/jwt.strategy';
import { UserController } from './adapters/primary/http/controllers/user.controller';
import { Station } from './bussiness/entities/station.entity';
import { StationSchema } from './adapters/secondary/mongo/schemas/document/station.schema';
import { Measurement } from './bussiness/entities/measurement.entity';
import { MeasurementSchema } from './adapters/secondary/mongo/schemas/document/measurement.schema';
import { SearchController } from './adapters/primary/http/controllers/search.controller';

const { mongo, jwt } = configuration();

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    MongooseModule.forRoot(mongo.uri),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Station.name, schema: StationSchema },
      { name: Measurement.name, schema: MeasurementSchema },
    ]),
    JwtModule.register({ global: true, secret: jwt.secret, signOptions: { expiresIn: '10d' } }),
    PassportModule,
  ],
  controllers: [
    AppController,
    AuthController,
    MeasurementController,
    StationController,
    UserController,
    SearchController,
  ],
  providers: [
    Logger,
    MeasurementService,
    { provide: IMeasurementService, useExisting: MeasurementService },
    StationService,
    { provide: IStationService, useExisting: StationService },
    AuthService,
    { provide: IAuthService, useExisting: AuthService },
    UserService,
    { provide: IUserService, useExisting: UserService },
    BcryptHashService,
    { provide: IHashService, useExisting: BcryptHashService },
    MongoTransactionService,
    { provide: ITransactionService, useExisting: MongoTransactionService },
    MongoMeasurementRepository,
    { provide: IMeasurementRepository, useExisting: MongoMeasurementRepository },
    MongoStationRepository,
    { provide: IStationRepository, useExisting: MongoStationRepository },
    MongoUserRepository,
    { provide: IUserRepository, useExisting: MongoUserRepository },
    LocalStrategy,
    JwtStrategy,
  ],
})
export class AppModule {}
