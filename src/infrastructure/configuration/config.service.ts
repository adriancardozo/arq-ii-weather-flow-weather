import { ConfigService } from '@nestjs/config';
import configuration, { Configuration } from './configuration';

export const CONFIG_SERVICE = new ConfigService<Configuration>(configuration());
