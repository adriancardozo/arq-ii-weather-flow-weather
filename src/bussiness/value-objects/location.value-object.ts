import { EditLocationInput } from '../ports/input/services/dtos/input/edit-location.input';

export type Longitude = number;

export type Latitude = number;

export class Location {
  type = 'Point' as const;

  get longitude(): Longitude {
    return this.coordinates[0];
  }

  set longitude(value: Longitude) {
    this.coordinates[0] = value;
  }

  get latitude(): Latitude {
    return this.coordinates[1];
  }

  set latitude(value: Latitude) {
    this.coordinates[1] = value;
  }

  constructor(public coordinates: [Longitude, Latitude]) {}

  edit({ longitude, latitude }: EditLocationInput) {
    this.longitude = longitude ?? this.longitude;
    this.latitude = latitude ?? this.latitude;
  }
}
