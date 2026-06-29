import { BussinessError } from './bussiness.error';

export class LastDayAverageTemperatureNotFoundError extends BussinessError {
  constructor(latitude: number, longitude: number, options?: ErrorOptions) {
    super(
      `No se encontro promedio de temperatura del ultimo dia para la ubicacion latitude=${latitude} longitude=${longitude}`,
      options,
    );
  }
}
