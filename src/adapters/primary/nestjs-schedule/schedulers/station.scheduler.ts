import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { IStationService } from 'src/bussiness/ports/input/services/i-station.service';
import { CONFIG_SERVICE } from 'src/infrastructure/configuration/config.service';
import { Configuration } from 'src/infrastructure/configuration/configuration';

const { synchronize_stations } = CONFIG_SERVICE.get<Configuration['schedulers']>('schedulers')!;

@Injectable()
export class StationScheduler {
  private readonly logger = new Logger(StationScheduler.name);

  constructor(private readonly stationService: IStationService) {}

  @Cron(synchronize_stations.cron, { disabled: synchronize_stations.disabled })
  async synchronizeStations(): Promise<void> {
    this.logger.log('Synchronizing stations.');
    await this.stationService.synchronizeStations();
  }
}
