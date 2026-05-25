import { EditUserInput } from '../ports/input/services/dtos/input/edit-user.input';
import { LoginInput } from '../ports/input/services/dtos/input/login.input';
import { IEntity } from './i.entity';
import { Measurement } from './measurement.entity';
import { Station } from './station.entity';

export class User extends IEntity<EditUserInput> {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  stations: Array<Station> = [];
  subscriptions: Array<Station> = [];
  alerts: Array<Measurement> = [];

  constructor(id: string | null);
  constructor(id: string, firstName: string, lastName: string, email: string, password: string);
  constructor(id: string | null, firstName?: string, lastName?: string, email?: string, password?: string) {
    super();
    this.id = id;
    if (firstName && lastName && email && password) {
      this.firstName = firstName;
      this.lastName = lastName;
      this.email = email;
      this.password = password;
    }
  }

  edit({ firstName, lastName, email }: EditUserInput) {
    this.firstName = firstName ?? this.firstName;
    this.lastName = lastName ?? this.lastName;
    this.email = email ?? this.email;
  }

  loginInput(): LoginInput {
    return new LoginInput(this.id, this.email);
  }

  addStation(station: Station) {
    this.stations = [...this.stations, station];
  }

  removeStation(id: string) {
    this.stations = this.stations?.filter((station) => station?.id !== id) ?? [];
  }

  subscribe(station: Station) {
    this.subscriptions = [...this.subscriptions, station];
  }

  notifyAlert(alert: Measurement): void {
    this.alerts = [...this.alerts, alert];
  }
}
