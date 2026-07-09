import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  UseFilters,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { VALIDATION_PIPE } from 'src/infrastructure/validation/validation.pipe';
import { BussinessExceptionFilter } from './filters/bussiness-error.filter';
import { ApiBody, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { IdDto } from './dtos/id.dto';
import { IStationService } from 'src/bussiness/ports/input/services/i-station.service';
import { StationResponse } from './responses/station.response';
import { CreateStationDto } from './dtos/create-station.dto';
import { EditStationDto } from './dtos/edit-station.dto';
import { SubscribeDto } from './dtos/subscribe.dto';
import { SubscribeResponse } from './responses/subscribe.response';
import { StationTemperatureResponse } from './responses/station-temperature.response';
import { AverageTemperatureResponse } from './responses/average-temperature.response';
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';
import configuration from 'src/infrastructure/configuration/configuration';

const { cache } = configuration();

@Controller('station')
@UsePipes(VALIDATION_PIPE)
@UseFilters(BussinessExceptionFilter)
export class StationController {
  constructor(private readonly stationService: IStationService) {}

  @ApiOperation({ summary: 'Get all stations' })
  @ApiOkResponse({ type: StationResponse, isArray: true })
  @Get()
  async getAll(): Promise<Array<StationResponse>> {
    const stations = await this.stationService.getAll();
    return stations.map((station) => new StationResponse(station));
  }

  @ApiOperation({ summary: 'Get a station' })
  @ApiOkResponse({ type: StationResponse })
  @Get(':id')
  async getById(@Param() param: IdDto): Promise<StationResponse> {
    return new StationResponse(await this.stationService.getById(param.id));
  }

  @ApiOperation({ summary: 'Create a station' })
  @ApiBody({ type: CreateStationDto })
  @ApiOkResponse({ type: StationResponse })
  @Post()
  async create(@Body() dto: CreateStationDto): Promise<StationResponse> {
    return new StationResponse(await this.stationService.create(dto.toInput()));
  }

  @ApiOperation({ summary: 'Delete a station' })
  @ApiOkResponse({ type: StationResponse })
  @Delete(':id')
  async delete(@Param() param: IdDto): Promise<StationResponse> {
    return new StationResponse(await this.stationService.delete(param.id));
  }

  @ApiOperation({ summary: 'Edit a station' })
  @ApiBody({ type: EditStationDto })
  @ApiOkResponse({ type: StationResponse })
  @Patch(':id')
  async edit(@Param() param: IdDto, @Body() dto: EditStationDto): Promise<StationResponse> {
    return new StationResponse(await this.stationService.edit(param.id, dto.toInput()));
  }

  @ApiOperation({ summary: 'Subscribe to station' })
  @ApiOkResponse({ type: SubscribeResponse })
  @Put(':id/subscribe/:user_id')
  async subscribe(@Param() param: SubscribeDto): Promise<SubscribeResponse> {
    return new SubscribeResponse(await this.stationService.subscribe(param.id, param.user_id));
  }

  @ApiOperation({ summary: 'Get current station temperature' })
  @ApiOkResponse({ type: StationTemperatureResponse })
  @Get(':id/current_temperature')
  async getCurrentTemperature(@Param() param: IdDto): Promise<StationTemperatureResponse> {
    return new StationTemperatureResponse(await this.stationService.getCurrentTemperature(param.id));
  }

  @ApiOperation({ summary: 'Day average station temperature' })
  @ApiOkResponse({ type: AverageTemperatureResponse })
  @CacheKey((context) => context.switchToHttp().getRequest().path)
  @CacheTTL(cache.ttl.average_day)
  @UseInterceptors(CacheInterceptor)
  @Get(':id/average_day')
  async getDayAverage(@Param() param: IdDto): Promise<AverageTemperatureResponse> {
    return new AverageTemperatureResponse(await this.stationService.getAverage(param.id, 'day'));
  }

  @ApiOperation({ summary: 'Week average station temperature' })
  @ApiOkResponse({ type: AverageTemperatureResponse })
  @CacheKey((context) => context.switchToHttp().getRequest().path)
  @CacheTTL(cache.ttl.average_week)
  @UseInterceptors(CacheInterceptor)
  @Get(':id/average_week')
  async getWeekAverage(@Param() param: IdDto): Promise<AverageTemperatureResponse> {
    return new AverageTemperatureResponse(await this.stationService.getAverage(param.id, 'week'));
  }
}
