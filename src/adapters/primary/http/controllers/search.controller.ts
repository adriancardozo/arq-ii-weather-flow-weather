import { Controller, Get, Query, UseFilters, UsePipes } from '@nestjs/common';
import { VALIDATION_PIPE } from 'src/infrastructure/validation/validation.pipe';
import { BussinessExceptionFilter } from './filters/bussiness-error.filter';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { SearchDto } from './dtos/search.dto';
import { IStationService } from 'src/bussiness/ports/input/services/i-station.service';
import { SearchResponse } from './responses/search.response';
import { SearchStationDto } from './dtos/search-station.dto';
import { StationResponse } from './responses/station.response';

@Controller('search')
@UsePipes(VALIDATION_PIPE)
@UseFilters(BussinessExceptionFilter)
export class SearchController {
  constructor(private readonly stationService: IStationService) {}

  @ApiOperation({ summary: 'Search measurements' })
  @ApiOkResponse({ type: SearchResponse })
  @Get('measurement')
  async search(@Query() query: SearchDto): Promise<SearchResponse> {
    return new SearchResponse(await this.stationService.search(query.toInput()));
  }

  @ApiOperation({ summary: 'Search stations' })
  @ApiOkResponse({ type: StationResponse, isArray: true })
  @Get('stations')
  async searchManyStations(@Query() query: SearchStationDto): Promise<StationResponse[]> {
    return (await this.stationService.searchStations(query.toInput())).map(
      (station) => new StationResponse(station),
    );
  }
}
