import { EditStationInput } from '../ports/input/services/dtos/input/edit-station.input';
import { IEntity } from './i.entity';
import { Location } from '../value-objects/location.value-object';
import { Measurement } from './measurement.entity';
import { SearchInput } from '../ports/input/services/dtos/input/search.input';
import { Search } from '../aggregates/search.aggergate';

export class Station extends IEntity<EditStationInput> {
  name: string;
  location: Location;
  sensorModel: string;
  state: 'active' | 'inactive' = 'active';
  provider: string | null;
  owner: string;
  subscribers: Array<string> = [];
  measurements: Array<Measurement>;

  constructor(id: string);
  constructor(
    id: string,
    name: string,
    location: Location,
    sensorModel: string,
    owner: string,
    state: 'active' | 'inactive',
    provider: string | null,
  );
  constructor(
    id: string,
    name?: string,
    location?: Location,
    sensorModel?: string,
    owner?: string,
    state: 'active' | 'inactive' = 'active',
    provider: string | null = null,
  ) {
    super();
    this.id = id;
    if (name && location && sensorModel && owner) {
      this.name = name;
      this.location = location;
      this.sensorModel = sensorModel;
      this.owner = owner;
      this.state = state;
      this.provider = provider;
    }
  }

  edit({ name, location, sensorModel, state, owner, provider }: EditStationInput) {
    this.name = name ?? this.name;
    if (location) this.location.edit(location);
    this.sensorModel = sensorModel ?? this.sensorModel;
    this.state = state ?? this.state;
    if (owner?.id) this.setOwner(owner.id);
    if (provider !== undefined) this.provider = provider;
  }

  setOwner(owner: string | null): void {
    this.owner = owner as any;
  }

  subscribe(user: string) {
    this.subscribers = [...this.subscribers, user];
  }

  addMeasurement(measurement: Measurement) {
    this.measurements = [...this.measurements, measurement];
  }

  search(input: SearchInput): Search {
    return new Search(this, input);
  }
}
