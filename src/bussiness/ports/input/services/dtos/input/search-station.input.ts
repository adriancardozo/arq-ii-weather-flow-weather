export class SearchStationInput {
  constructor(
    public activeRange: number,
    public station?: string,
    public minTemperature?: number,
    public maxTemperature?: number,
    public active?: boolean,
    public fromDate?: Date,
    public toDate?: Date,
  ) {}
}
