import { RegisterMeasurementInput } from '../../input/services/dtos/input/register-measurement.input';
import { Location } from 'src/bussiness/value-objects/location.value-object';

export abstract class IWeatherProviderService {
  abstract measure(station: string | null, location: Location): Promise<RegisterMeasurementInput>;
}
