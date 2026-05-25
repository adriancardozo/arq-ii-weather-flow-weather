import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import configuration from 'src/infrastructure/configuration/configuration';
import { mock } from 'test/resources/mocks/mock';
import { ITransactionService } from 'src/bussiness/ports/output/services/i-transaction.service';
import { MockTransactionService } from 'test/resources/mocks/bussiness/ports/output/services/mock-transaction.service';
import {
  deletedStation,
  deleteStationId,
  editedStation,
  editStationId,
  editStationInput,
  foundByIdStation,
  foundStations,
  createStationInput,
  notFoundError,
  session,
  toEditStation,
  toFindId,
  unknownError,
  station,
} from './data/station.service.spec.data';
import { StationService } from 'src/bussiness/services/station.service';
import { IStationRepository } from 'src/bussiness/ports/output/repositories/i-station.repository';

describe('StationService', () => {
  let stationService: StationService;
  let stationRepository: jest.Mocked<IStationRepository>;
  let transactionService: jest.Mocked<ITransactionService>;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({ isGlobal: true, load: [configuration] })],
      providers: [StationService, { provide: ITransactionService, useClass: MockTransactionService }],
    })
      .useMocker(mock)
      .compile();

    stationService = app.get<StationService>(StationService);
    transactionService = app.get<jest.Mocked<ITransactionService>>(ITransactionService);
    stationRepository = app.get<jest.Mocked<IStationRepository>>(IStationRepository);
  });

  describe('GetAll', () => {
    beforeEach(() => {
      stationRepository.find.mockResolvedValue(foundStations);
    });

    it('should return found stations', async () => {
      const result = await stationService.getAll(session);
      expect(result).toEqual(foundStations);
    });

    it('should find stations', async () => {
      await stationService.getAll(session);
      expect(stationRepository.find).toHaveBeenCalledWith({}, session);
    });

    it('should execute in transaction', async () => {
      const transaction = jest.spyOn(transactionService, 'transaction');
      await stationService.getAll(session);
      expect(transaction).toHaveBeenCalled();
    });

    describe('Find stations error', () => {
      beforeEach(() => {
        stationRepository.find.mockRejectedValue(unknownError);
      });

      it('should fail if error on find stations', async () => {
        const result = stationService.getAll(session);
        await expect(result).rejects.toEqual(unknownError);
      });
    });
  });

  describe('Get', () => {
    beforeEach(() => {
      stationRepository.findOneByOrFail.mockResolvedValue(foundByIdStation);
    });

    it('should return found station', async () => {
      const result = await stationService.getById(toFindId, session);
      expect(result).toEqual(foundByIdStation);
    });

    it('should find station', async () => {
      await stationService.getById(toFindId, session);
      expect(stationRepository.findOneByOrFail).toHaveBeenCalledWith({ id: toFindId }, session);
    });

    it('should execute in transaction', async () => {
      const transaction = jest.spyOn(transactionService, 'transaction');
      await stationService.getById(toFindId, session);
      expect(transaction).toHaveBeenCalled();
    });

    describe('Station not found', () => {
      beforeEach(() => {
        stationRepository.findOneByOrFail.mockRejectedValue(notFoundError);
      });

      it('should fail if station not found', async () => {
        const result = stationService.getById(toFindId, session);
        await expect(result).rejects.toEqual(notFoundError);
      });
    });

    describe('Find station error', () => {
      beforeEach(() => {
        stationRepository.findOneByOrFail.mockRejectedValue(unknownError);
      });

      it('should fail if error on find station', async () => {
        const result = stationService.getById(toFindId, session);
        await expect(result).rejects.toEqual(unknownError);
      });
    });
  });

  describe('Create', () => {
    beforeEach(() => {
      stationRepository.save.mockResolvedValue(station);
    });

    it('should return created station', async () => {
      const result = await stationService.create(createStationInput, session);
      expect(result).toEqual(station);
    });

    it('should save station', async () => {
      await stationService.create(createStationInput, session);
      expect(stationRepository.save).toHaveBeenCalledWith(createStationInput, session);
    });

    it('should execute in transaction', async () => {
      const transaction = jest.spyOn(transactionService, 'transaction');
      await stationService.create(createStationInput, session);
      expect(transaction).toHaveBeenCalled();
    });

    describe('Create station error', () => {
      beforeEach(() => {
        stationRepository.save.mockRejectedValue(unknownError);
      });

      it('should fail if error on save station', async () => {
        const result = stationService.create(createStationInput, session);
        await expect(result).rejects.toEqual(unknownError);
      });
    });
  });

  describe('Delete', () => {
    beforeEach(() => {
      stationRepository.findOneByOrFail.mockResolvedValue(deletedStation);
    });

    it('should return deleted station', async () => {
      const result = await stationService.delete(deleteStationId, session);
      expect(result).toEqual(deletedStation);
    });

    it('should find to delete station', async () => {
      await stationService.delete(deleteStationId, session);
      expect(stationRepository.findOneByOrFail).toHaveBeenCalledWith({ id: deleteStationId }, session);
    });

    it('should delete station', async () => {
      await stationService.delete(deleteStationId, session);
      expect(stationRepository.deleteOneBy).toHaveBeenCalledWith({ id: deleteStationId }, session);
    });

    it('should execute in transaction', async () => {
      const transaction = jest.spyOn(transactionService, 'transaction');
      await stationService.delete(deleteStationId, session);
      expect(transaction).toHaveBeenCalled();
    });

    describe('Station not found on delete', () => {
      beforeEach(() => {
        stationRepository.deleteOneBy.mockRejectedValue(notFoundError);
      });

      it('should fail if station not found', async () => {
        const result = stationService.delete(deleteStationId, session);
        await expect(result).rejects.toEqual(notFoundError);
      });
    });

    describe('Station not found on find', () => {
      beforeEach(() => {
        stationRepository.findOneByOrFail.mockRejectedValue(notFoundError);
      });

      it('should fail if station not found', async () => {
        const result = stationService.delete(deleteStationId, session);
        await expect(result).rejects.toEqual(notFoundError);
      });
    });

    describe('Delete station error', () => {
      beforeEach(() => {
        stationRepository.deleteOneBy.mockRejectedValue(unknownError);
      });

      it('should fail if error on delete station', async () => {
        const result = stationService.delete(deleteStationId, session);
        await expect(result).rejects.toEqual(unknownError);
      });
    });

    describe('Delete station error on find', () => {
      beforeEach(() => {
        stationRepository.findOneByOrFail.mockRejectedValue(unknownError);
      });

      it('should fail if error on find station', async () => {
        const result = stationService.delete(deleteStationId, session);
        await expect(result).rejects.toEqual(unknownError);
      });
    });
  });

  describe('Edit', () => {
    beforeEach(() => {
      stationRepository.findOneByOrFail.mockResolvedValue(toEditStation);
      stationRepository.updateOne.mockResolvedValue(editedStation);
    });

    it('should return edited station', async () => {
      const result = await stationService.edit(editStationId, editStationInput, session);
      expect(result).toEqual(editedStation);
    });

    it('should find to edit station', async () => {
      await stationService.edit(editStationId, editStationInput, session);
      expect(stationRepository.findOneByOrFail).toHaveBeenCalledWith({ id: editStationId }, session);
    });

    it('should edit station', async () => {
      await stationService.edit(editStationId, editStationInput, session);
      expect(toEditStation.edit).toHaveBeenCalledWith(editStationInput);
    });

    it('should save changes', async () => {
      await stationService.edit(editStationId, editStationInput, session);
      expect(stationRepository.updateOne).toHaveBeenCalledWith(toEditStation, session);
    });

    it('should execute in transaction', async () => {
      const transaction = jest.spyOn(transactionService, 'transaction');
      await stationService.edit(editStationId, editStationInput, session);
      expect(transaction).toHaveBeenCalled();
    });

    describe('Station not found on edit', () => {
      beforeEach(() => {
        stationRepository.updateOne.mockRejectedValue(notFoundError);
      });

      it('should fail if station not found', async () => {
        const result = stationService.edit(editStationId, editStationInput, session);
        await expect(result).rejects.toEqual(notFoundError);
      });
    });

    describe('Station not found on find', () => {
      beforeEach(() => {
        stationRepository.findOneByOrFail.mockRejectedValue(notFoundError);
      });

      it('should fail if station not found', async () => {
        const result = stationService.edit(editStationId, editStationInput, session);
        await expect(result).rejects.toEqual(notFoundError);
      });
    });

    describe('Edit station error', () => {
      beforeEach(() => {
        stationRepository.updateOne.mockRejectedValue(unknownError);
      });

      it('should fail if error on edit station', async () => {
        const result = stationService.edit(editStationId, editStationInput, session);
        await expect(result).rejects.toEqual(unknownError);
      });
    });

    describe('Edit station error on find', () => {
      beforeEach(() => {
        stationRepository.findOneByOrFail.mockRejectedValue(unknownError);
      });

      it('should fail if error on find station', async () => {
        const result = stationService.edit(editStationId, editStationInput, session);
        await expect(result).rejects.toEqual(unknownError);
      });
    });
  });
});
