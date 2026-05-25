export class RegisterMeasurementInput {
  constructor(
    public pressure: number,
    public temperature: number,
    public humidity: number,
    public station: string,
  ) {}
}
