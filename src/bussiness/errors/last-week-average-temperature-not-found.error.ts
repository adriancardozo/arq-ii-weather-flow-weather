import { BussinessError } from './bussiness.error';

export class LastWeekAverageTemperatureNotFoundError extends BussinessError {
  constructor(latitude: number, longitude: number, options?: ErrorOptions) {
    super(
      `No se encontro promedio de temperatura de la ultima semana para la ubicacion latitude=${latitude} longitude=${longitude}`,
      options,
    );
  }
}
