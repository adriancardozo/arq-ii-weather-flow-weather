import { ITransactionService } from 'src/bussiness/ports/output/services/i-transaction.service';

export class MockTransactionService<Session = any> implements ITransactionService<Session> {
  async transaction<T>(callback: (session: any) => Promise<T>, session?: Session): Promise<T> {
    return await callback(session);
  }
}
