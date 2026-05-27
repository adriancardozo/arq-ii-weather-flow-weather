export abstract class IUserStationService {
  abstract addSubscription(userId: string, stationId: string | null): Promise<void>;

  abstract updateOwner(
    stationId: string | null,
    oldOwner: string | null,
    owner: string | null,
  ): Promise<void>;
}
