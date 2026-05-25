import { InjectConnection } from '@nestjs/mongoose';
import { ClientSession, Connection } from 'mongoose';
import { ITransactionService } from 'src/bussiness/ports/output/services/i-transaction.service';

export class MongoTransactionService implements ITransactionService<ClientSession> {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  async transaction<T>(
    callback: (session: ClientSession) => Promise<T>,
    session?: ClientSession,
  ): Promise<T> {
    if (session) {
      return await callback(session);
    } else {
      const newSession = await this.connection.startSession();
      newSession.startTransaction();
      try {
        const result = await callback(newSession);
        await newSession.commitTransaction();
        return result;
      } catch (error) {
        await newSession.abortTransaction();
        throw error;
      }
    }
  }
}
