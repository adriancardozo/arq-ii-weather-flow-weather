import { ICurrentTemperatureService } from 'src/bussiness/ports/output/services/i-current-temperature.service';

export class MockCurrentTemperatureService implements ICurrentTemperatureService {
  getCurrentByCoordinates(latitude: number, longitude: number): Promise<number> {
    throw new Error('Method not implemented.');
  }
}
