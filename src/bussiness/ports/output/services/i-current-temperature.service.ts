export abstract class ICurrentTemperatureService {
  abstract getCurrentByCoordinates(latitude: number, longitude: number): Promise<number>;
}
