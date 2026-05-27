export class NotifyAlertDto {
  constructor(
    public users: Array<string>,
    public measurement_id: string,
    public datetime: Date,
    public alert_type: 'Ninguna' | 'Calor extremo' | 'Helada' | 'Tormenta' | 'Humedad crítica',
    public pressure: number,
    public temperature: number,
    public humidity: number,
    public station: string,
  ) {}
}
