import { BussinessError } from './bussiness.error';

export class CurrentTemperatureNotFoundError extends BussinessError {
  constructor(latitude: number, longitude: number, options?: ErrorOptions) {
    super(
      `No se encontro temperatura actual para la ubicacion latitude=${latitude} longitude=${longitude}`,
      options,
    );
  }
}
