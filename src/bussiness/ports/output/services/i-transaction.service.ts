export abstract class ITransactionService<Session = any> {
  abstract transaction<T>(callback: (session: Session) => Promise<T>, session?: Session): Promise<T>;
}
