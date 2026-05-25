import { EditLocationInput } from 'src/bussiness/ports/input/services/dtos/input/edit-location.input';

export const originalLongitude = 0;

export const originalLatitude = 1;

export const editLongitudeInput: EditLocationInput = new EditLocationInput(2);

export const editLatitudeInput: EditLocationInput = new EditLocationInput(undefined, 3);

export const emptyInput: EditLocationInput = new EditLocationInput();
