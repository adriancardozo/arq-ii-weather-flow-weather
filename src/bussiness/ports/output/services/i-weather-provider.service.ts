import { Measurement } from 'src/bussiness/entities/measurement.entity';
import { Station } from 'src/bussiness/entities/station.entity';

export abstract class IWeatherProviderService {
  abstract measure(station: Station): Promise<Measurement>;
}
