import { BussinessError } from './bussiness.error';

export class UnknownError extends BussinessError {
  constructor(message?: string, options?: ErrorOptions) {
    super(message ?? 'Error desconocido', options);
  }
}
