export abstract class IQueueService {
  abstract send<T>(queue: string, data: T): Promise<void>;
}
