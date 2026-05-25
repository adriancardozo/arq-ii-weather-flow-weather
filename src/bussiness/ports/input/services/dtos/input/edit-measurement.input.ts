import { EditIdInput } from './edit-id.input';

export class EditMeasurementInput {
  station?: EditIdInput;

  constructor(
    public pressure?: number,
    public temperature?: number,
    public humidity?: number,
    stationId?: string,
  ) {
    this.station = stationId ? new EditIdInput(stationId) : undefined;
  }
}
