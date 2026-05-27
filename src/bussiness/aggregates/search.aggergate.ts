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
    const {
      active,
      maxTemperature,
      minTemperature,
      fromDate,
      toDate,
      maxPressure,
      minPressure,
      maxHumidity,
      minHumidity,
    } = this.input;
    this.results = this.station.measurements;
    if (active !== undefined) this.filterByActive();
    if (minTemperature || maxTemperature) this.filterByRange(minTemperature, maxTemperature, 'temperature');
    if (minPressure || maxPressure) this.filterByRange(minPressure, maxPressure, 'pressure');
    if (minHumidity || maxHumidity) this.filterByRange(minHumidity, maxHumidity, 'humidity');
    if (fromDate || toDate) this.filterByRange(fromDate, toDate, 'datetime');
  }

  private filterByRange(
    min: number | undefined | Date,
    max: number | undefined | Date,
    field: 'temperature' | 'pressure' | 'humidity' | 'datetime',
  ) {
    if (min !== undefined) this.results = this.results.filter((result) => result[field] >= min);
    if (max !== undefined) this.results = this.results.filter((result) => result[field] <= max);
  }

  private filterByActive() {
    this.results = this.results.filter(
      (result) => this.input.active === result.active(this.input.activeRange),
    );
  }
}
