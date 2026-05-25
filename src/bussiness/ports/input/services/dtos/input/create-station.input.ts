import { Location } from 'src/bussiness/value-objects/location.value-object';

export class CreateStationInput {
  constructor(
    public name: string,
    public location: Location,
    public sensorModel: string,
    public owner: string,
  ) {}
}
