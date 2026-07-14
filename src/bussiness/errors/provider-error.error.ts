import { BussinessError } from './bussiness.error';

export class ProviderError extends BussinessError {
  constructor(message?: string, options?: ErrorOptions) {
    super(message ?? 'Proveedor temporalmente no disponible.', options);
  }
}
