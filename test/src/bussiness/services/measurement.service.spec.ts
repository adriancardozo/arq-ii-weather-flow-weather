import { ConfigService } from '@nestjs/config';
import { Measurement } from 'src/bussiness/entities/measurement.entity';
import { MeasurementService } from 'src/bussiness/services/measurement.service';
import { ITransactionService } from 'src/bussiness/ports/output/services/i-transaction.service';
import { IMeasurementRepository } from 'src/bussiness/ports/output/repositories/i-measurement.repository';
import { IAlertService } from 'src/bussiness/ports/output/services/i-alert.service';
import { IStationRepository } from 'src/bussiness/ports/output/repositories/i-station.repository';
import {
  createMeasurementInput,
  savedMeasurement,
  session,
  station,
} from './data/measurement.service.spec.data';

describe('MeasurementService fallbacks', () => {
  const createService = (fallbackEnabled: boolean) => {
    const measurementRepository = {
      save: jest.fn().mockResolvedValue(savedMeasurement),
    } as unknown as jest.Mocked<IMeasurementRepository>;

    const stationRepository = {
      findOneByOrFail: jest.fn().mockResolvedValue(station),
      updateOne: jest.fn().mockResolvedValue(station),
    } as unknown as jest.Mocked<IStationRepository>;

    const alertService = {
      notifyAlert: jest.fn().mockRejectedValue(new Error('service-bus down')),
    } as unknown as jest.Mocked<IAlertService>;

    const configService = {
      get: jest.fn().mockImplementation((key: string) => {
        if (key === 'alerts.fallback_enabled') return fallbackEnabled;
        return undefined;
      }),
    } as unknown as jest.Mocked<ConfigService>;

    const transactionService = {
      transaction: jest.fn((callback: (session?: any) => Promise<any>, txSession?: any) =>
        callback(txSession),
      ),
    } as unknown as jest.Mocked<ITransactionService>;

    const service = new MeasurementService(
      measurementRepository,
      transactionService,
      alertService,
      stationRepository,
      configService,
    );

    return { service, measurementRepository, stationRepository, alertService, transactionService };
  };

  it('should persist measurement even if alert notification fails when fallback is enabled', async () => {
    const { service, measurementRepository, stationRepository, alertService } = createService(true);

    const result = await service.create(createMeasurementInput, session as any);

    expect(result).toEqual(savedMeasurement);
    expect(measurementRepository.save).toHaveBeenCalledWith(expect.any(Measurement), session);
    expect(stationRepository.updateOne).toHaveBeenCalledWith(station, session);
    expect(alertService.notifyAlert).toHaveBeenCalledWith(station.subscribers, savedMeasurement);
  });

  it('should propagate alert notification error when fallback is disabled', async () => {
    const { service, measurementRepository, stationRepository, alertService } = createService(false);

    await expect(service.create(createMeasurementInput as any, session as any)).rejects.toThrow(
      'service-bus down',
    );
    expect(measurementRepository.save).toHaveBeenCalledWith(expect.any(Measurement), session);
    expect(stationRepository.updateOne).not.toHaveBeenCalled();
    expect(alertService.notifyAlert).toHaveBeenCalledWith(station.subscribers, savedMeasurement);
  });
});
