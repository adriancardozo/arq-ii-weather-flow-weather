export abstract class ICurrentTemperatureService {
  abstract getCurrentByCoordinates(latitude: number, longitude: number): Promise<number>;

  abstract getLastDayAverageByCoordinates(latitude: number, longitude: number): Promise<number>;
}
