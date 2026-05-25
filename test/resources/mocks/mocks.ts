import { ITransactionService } from 'src/bussiness/ports/output/services/i-transaction.service';
import { MockTransactionService } from './bussiness/ports/output/services/mock-transaction.service';
import { IHashService } from 'src/bussiness/ports/output/services/i-hash.service';
import { MockHashService } from './bussiness/ports/output/services/mock-hash.service';
import { IUserRepository } from 'src/bussiness/ports/output/repositories/i-user.repository';
import { MockUserRepository } from './bussiness/ports/output/repositories/mock-user.repository';
import { IUserService } from 'src/bussiness/ports/input/services/i-user.service';
import { MockUserService } from './bussiness/ports/input/services/mock-user.service';
import { IStationRepository } from 'src/bussiness/ports/output/repositories/i-station.repository';
import { MockStationRepository } from './bussiness/ports/output/repositories/mock-station.repository';

export const mocks = {
  [ITransactionService.name]: MockTransactionService,
  [IHashService.name]: MockHashService,
  [IUserRepository.name]: MockUserRepository,
  [IUserService.name]: MockUserService,
  [IStationRepository.name]: MockStationRepository,
};
