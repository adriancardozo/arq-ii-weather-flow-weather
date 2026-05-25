import { BussinessError } from './bussiness.error';

export class UserNotFoundError extends BussinessError {
  constructor(message?: string, options?: ErrorOptions) {
    super(message ?? 'Usuario no encontrado', options);
  }
}
