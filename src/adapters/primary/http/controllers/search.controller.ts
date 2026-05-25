import { Controller, Get, Query, UseFilters, UseGuards, UsePipes } from '@nestjs/common';
import { VALIDATION_PIPE } from 'src/infrastructure/validation/validation.pipe';
import { BussinessExceptionFilter } from './filters/bussiness-error.filter';
import { ApiBearerAuth, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { SearchDto } from './dtos/search.dto';
import { IStationService } from 'src/bussiness/ports/input/services/i-station.service';
import { SearchResponse } from './responses/search.response';

@Controller('search')
@UsePipes(VALIDATION_PIPE)
@UseFilters(BussinessExceptionFilter)
export class SearchController {
  constructor(private readonly stationService: IStationService) {}

  @ApiOperation({ summary: 'Search measurements' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: SearchResponse })
  @Get()
  async search(@Query() query: SearchDto): Promise<SearchResponse> {
    return new SearchResponse(await this.stationService.search(query.toInput()));
  }
}
