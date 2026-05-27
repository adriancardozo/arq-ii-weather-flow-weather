import { IUserStationService } from 'src/bussiness/ports/output/services/i-user-station.service';

export class MockUserStationService implements IUserStationService {
  addSubscription(userId: string, stationId: string | null): Promise<void> {
    throw new Error('Method not implemented.');
  }
  updateOwner(stationId: string | null, oldOwner: string | null, owner: string | null): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
