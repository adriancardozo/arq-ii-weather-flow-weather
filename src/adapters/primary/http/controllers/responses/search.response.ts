import { ApiProperty } from '@nestjs/swagger';
import { StationResponse } from './station.response';
import { MeasurementResponse } from './measurement.response';
import { Search } from 'src/bussiness/aggregates/search.aggergate';
import { SearchStation } from 'src/bussiness/aggregates/search-station.aggregate';

export class SearchResponse {
  @ApiProperty({ type: StationResponse })
  station: StationResponse;
  @ApiProperty({ type: MeasurementResponse, isArray: true })
  results: Array<MeasurementResponse>;

  constructor(search: Search | SearchStation) {
    this.station = new StationResponse(search.station);
    this.results = search.results.map((result) => new MeasurementResponse(result));
  }
}
