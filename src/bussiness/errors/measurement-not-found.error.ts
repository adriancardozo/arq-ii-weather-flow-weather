import { BussinessError } from './bussiness.error';

export class MeasurementNotFoundError extends BussinessError {
  constructor(message?: string, options?: ErrorOptions) {
    super(message ?? 'Medición no encontrada', options);
  }
}
