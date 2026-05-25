import { EditLocationInput } from './edit-location.input';
import { EditStationOwnerInput } from './edit-station-owner.input';

export class EditStationInput {
  owner?: EditStationOwnerInput;
  location?: EditLocationInput;

  constructor(
    public name?: string,
    longitude?: number,
    latitude?: number,
    public sensorModel?: string,
    public state?: 'active' | 'inactive',
    ownerId?: string,
  ) {
    this.owner = ownerId ? new EditStationOwnerInput(ownerId) : undefined;
    this.location =
      latitude !== undefined || longitude !== undefined
        ? new EditLocationInput(longitude, latitude)
        : undefined;
  }
}
