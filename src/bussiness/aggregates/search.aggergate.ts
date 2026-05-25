import { Measurement } from '../entities/measurement.entity';
import { Station } from '../entities/station.entity';
import { SearchInput } from '../ports/input/services/dtos/input/search.input';

export class Search {
  results: Array<Measurement> = [];

  constructor(
    public station: Station,
    public input: SearchInput,
  ) {
    this.search();
  }

  private search() {
    const { active, maxTemperature, minTemperature } = this.input;
    this.results = this.station.measurements;
    if (active !== undefined) this.filterByActive();
    if (minTemperature || maxTemperature) this.filterByTemperatureRange();
  }

  private filterByActive() {
    this.results = this.results.filter(
      (result) => this.input.active === result.active(this.input.activeRange),
    );
  }

  private filterByTemperatureRange() {
    const { minTemperature: min, maxTemperature: max } = this.input;
    if (min !== undefined) this.results = this.results.filter((result) => result.temperature >= min);
    if (max !== undefined) this.results = this.results.filter((result) => result.temperature <= max);
  }
}
