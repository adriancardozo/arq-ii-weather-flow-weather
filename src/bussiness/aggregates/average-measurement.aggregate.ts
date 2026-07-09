import { Measurement } from '../entities/measurement.entity';
import { Station } from '../entities/station.entity';

export class AverageMeasurement {
  period: 'day' | 'week' = 'day';
  measurements: Array<Measurement>;
  station: Station;
  averageTemperature: number;

  setPeriod(period: 'day' | 'week') {
    this.period = period;
    return this;
  }

  setMeasurements(measurements: Array<Measurement>) {
    this.measurements = measurements;
    this.averageTemperature = this.computeAverage();
    return this;
  }

  setStation(station: Station) {
    this.station = station;
    return this;
  }

  get from(): Date {
    return new Date(Date.now() - this.periodMillis());
  }

  private periodMillis(): number {
    const millis = { day: 24 * 60 * 60 * 1000, week: 7 * 24 * 60 * 60 * 1000 };
    return millis[this.period];
  }

  private computeAverage() {
    return (
      this.measurements.reduce((previous, current) => previous + current.temperature, 0) /
      this.measurements.length
    );
  }
}
