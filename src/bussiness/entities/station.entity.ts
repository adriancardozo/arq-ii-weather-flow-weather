import { EditStationInput } from '../ports/input/services/dtos/input/edit-station.input';
import { IEntity } from './i.entity';
import { User } from './user.entity';
import { Location } from '../value-objects/location.value-object';
import { Measurement } from './measurement.entity';
import { SearchInput } from '../ports/input/services/dtos/input/search.input';
import { Search } from '../aggregates/search.aggergate';

export class Station extends IEntity<EditStationInput> {
  name: string;
  location: Location;
  sensorModel: string;
  state: 'active' | 'inactive' = 'active';
  owner: User;
  subscribers: Array<User> = [];
  measurements: Array<Measurement>;

  constructor(id: string);
  constructor(
    id: string,
    name: string,
    location: Location,
    sensorModel: string,
    owner: User,
    state: 'active' | 'inactive',
  );
  constructor(
    id: string,
    name?: string,
    location?: Location,
    sensorModel?: string,
    owner?: User,
    state: 'active' | 'inactive' = 'active',
  ) {
    super();
    this.id = id;
    if (name && location && sensorModel && owner) {
      this.name = name;
      this.location = location;
      this.sensorModel = sensorModel;
      this.owner = owner;
      this.state = state;
    }
  }

  edit({ name, location, sensorModel, state, owner }: EditStationInput) {
    this.name = name ?? this.name;
    if (location) this.location.edit(location);
    this.sensorModel = sensorModel ?? this.sensorModel;
    this.state = state ?? this.state;
    if (owner?.id) this.setOwner(new User(owner.id));
  }

  setOwner(owner: User | null): void {
    this.owner = owner ?? new User(null);
  }

  subscribe(user: User) {
    this.subscribers = [...this.subscribers, user];
    user.subscribe(this);
  }

  addMeasurement(measurement: Measurement) {
    this.measurements = [...this.measurements, measurement];
  }

  search(input: SearchInput): Search {
    return new Search(this, input);
  }

  private notifyAlert(measurement: Measurement) {
    this.subscribers?.forEach((subscriber) => subscriber.notifyAlert(measurement));
  }
}
