import { Measurement } from 'src/bussiness/entities/measurement.entity';
import { Station } from 'src/bussiness/entities/station.entity';

export const session = {};
export const stationId = 'station-1';
export const userId = 'user-1';

export const station = {
  id: stationId,
  subscribers: [userId],
  addMeasurement: jest.fn(),
} as unknown as Station;

export const alertMeasurement = {
  id: 'measurement-1',
  alert: true,
  alertType: 'Calor extremo',
  pressure: 1010,
  temperature: 45,
  humidity: 30,
  station,
  datetime: new Date('2026-06-29T00:00:00.000Z'),
} as Measurement;

export const savedMeasurement = alertMeasurement;
export const createMeasurementInput = {
  station: stationId,
  pressure: 1010,
  temperature: 45,
  humidity: 30,
};
