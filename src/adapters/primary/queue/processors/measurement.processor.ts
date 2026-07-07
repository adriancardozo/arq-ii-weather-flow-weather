import { ServiceBusProcessorManager } from '../helpers/service-bus-processor-manager.helper';
import { Injectable } from '@nestjs/common';
import { IMeasurementService } from 'src/bussiness/ports/input/services/i-measurement.service';
import { CreateMeasurementDto } from './dtos/create-measurement.dto';

@Injectable()
export class MeasurementProcessor {
  constructor(
    private readonly manager: ServiceBusProcessorManager,
    private readonly measurementService: IMeasurementService,
  ) {
    this.manager.add(
      'measurement',
      (data: CreateMeasurementDto) => this.measurement(data),
      CreateMeasurementDto,
    );
  }

  async measurement(data: CreateMeasurementDto): Promise<void> {
    await this.measurementService.create(data.toInput());
  }
}
