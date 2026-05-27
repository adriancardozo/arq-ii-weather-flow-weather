import { Measurement } from '../entities/measurement.entity';
import { Station } from '../entities/station.entity';
import { SearchStationInput } from '../ports/input/services/dtos/input/search-station.input';

export class SearchStation {
  results: Measurement[] = [];

  constructor(
    public station: Station,
    public input: SearchStationInput,
  ) {
    this.search();
  }

  private search() {
    const { active, maxTemperature, minTemperature, fromDate, toDate } = this.input;
    this.results = this.station.measurements;
    if (active !== undefined) this.filterByActive();
    if (minTemperature || maxTemperature) this.filterByTemperatureRange();
    if (fromDate || toDate) this.filterByCreatedDateRange();
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

  private filterByCreatedDateRange() {
    const { fromDate, toDate } = this.input;
    if (fromDate !== undefined) this.results = this.results.filter((result) => result.datetime >= fromDate);
    if (toDate !== undefined) this.results = this.results.filter((result) => result.datetime <= toDate);
  }
}
