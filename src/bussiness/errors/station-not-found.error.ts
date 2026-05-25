import { BussinessError } from './bussiness.error';

export class StationNotFoundError extends BussinessError {
  constructor(message?: string, options?: ErrorOptions) {
    super(message ?? 'Estación no encontrada', options);
  }
}
