export class SearchInput {
  constructor(
    public station: string,
    public activeRange: number,
    public minTemperature?: number,
    public maxTemperature?: number,
    public minPressure?: number,
    public maxPressure?: number,
    public minHumidity?: number,
    public maxHumidity?: number,
    public active?: boolean,
    public fromDate?: Date,
    public toDate?: Date,
  ) {}
}
