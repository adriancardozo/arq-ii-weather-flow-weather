import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseFilters,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { VALIDATION_PIPE } from 'src/infrastructure/validation/validation.pipe';
import { BussinessExceptionFilter } from './filters/bussiness-error.filter';
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { IdDto } from './dtos/id.dto';
import { IMeasurementService } from 'src/bussiness/ports/input/services/i-measurement.service';
import { MeasurementResponse } from './responses/measurement.response';
import { CreateMeasurementDto } from './dtos/create-measurement.dto';
import { EditMeasurementDto } from './dtos/edit-measurement.dto';

@Controller('measurement')
@UsePipes(VALIDATION_PIPE)
@UseFilters(BussinessExceptionFilter)
export class MeasurementController {
  constructor(private readonly measurementService: IMeasurementService) {}

  @ApiOperation({ summary: 'Get all measurements' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: MeasurementResponse, isArray: true })
  @Get()
  async getAll(): Promise<Array<MeasurementResponse>> {
    const measurements = await this.measurementService.getAll();
    return measurements.map((measurement) => new MeasurementResponse(measurement));
  }

  @ApiOperation({ summary: 'Get a measurement' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: MeasurementResponse })
  @Get(':id')
  async getById(@Param() param: IdDto): Promise<MeasurementResponse> {
    return new MeasurementResponse(await this.measurementService.getById(param.id));
  }

  @ApiOperation({ summary: 'Create a measurement' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiBody({ type: CreateMeasurementDto })
  @ApiOkResponse({ type: MeasurementResponse })
  @Post()
  async create(@Body() dto: CreateMeasurementDto): Promise<MeasurementResponse> {
    return new MeasurementResponse(await this.measurementService.create(dto.toInput()));
  }

  @ApiOperation({ summary: 'Delete a measurement' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: MeasurementResponse })
  @Delete(':id')
  async delete(@Param() param: IdDto): Promise<MeasurementResponse> {
    return new MeasurementResponse(await this.measurementService.delete(param.id));
  }

  @ApiOperation({ summary: 'Edit a measurement' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiBody({ type: EditMeasurementDto })
  @ApiOkResponse({ type: MeasurementResponse })
  @Patch(':id')
  async edit(@Param() param: IdDto, @Body() dto: EditMeasurementDto): Promise<MeasurementResponse> {
    return new MeasurementResponse(await this.measurementService.edit(param.id, dto.toInput()));
  }
}
