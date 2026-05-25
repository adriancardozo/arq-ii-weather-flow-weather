export class SearchInput {
  constructor(
    public station: string,
    public activeRange: number,
    public minTemperature?: number,
    public maxTemperature?: number,
    public active?: boolean,
  ) {}
}
