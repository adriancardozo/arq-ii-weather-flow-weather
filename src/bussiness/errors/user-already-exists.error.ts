import { BussinessError } from './bussiness.error';

export class UserAlreadyExistsError extends BussinessError {
  constructor(message?: string, options?: ErrorOptions) {
    super(message ?? 'El usuario ya existe', options);
  }
}
