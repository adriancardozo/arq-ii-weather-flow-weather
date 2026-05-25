import { User } from 'src/bussiness/entities/user.entity';
import { EditStationInput } from 'src/bussiness/ports/input/services/dtos/input/edit-station.input';
import { Location } from 'src/bussiness/value-objects/location.value-object';
import { mock } from 'test/resources/mocks/mock';

export const originalId = '1234abcd';

export const originalName = 'Estacion 1';

export const originalLocation: jest.Mocked<Location> = mock(Location);

export const originalSensorModel = 'Sensor model';

export const originalOwner: jest.Mocked<User> = mock(User);

export const originalState = 'active';

export const editSensorModelInput: EditStationInput = { sensorModel: 'New sensor model' };

export const editNameInput: EditStationInput = { name: 'Nueva estación' };

export const editLocationInput: EditStationInput = { location: mock(Location) };

export const emptyInput = new EditStationInput();

export const editOwnerInput: EditStationInput = { owner: { id: 'newownerid' } };

export const editStateInput: EditStationInput = { state: 'inactive' };
