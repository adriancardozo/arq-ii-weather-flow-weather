import { Station } from 'src/bussiness/entities/station.entity';
import { User } from 'src/bussiness/entities/user.entity';
import { StationNotFoundError } from 'src/bussiness/errors/station-not-found.error';
import { UnknownError } from 'src/bussiness/errors/unknown.error';
import { CreateStationInput } from 'src/bussiness/ports/input/services/dtos/input/create-station.input';
import { EditStationInput } from 'src/bussiness/ports/input/services/dtos/input/edit-station.input';
import { mock } from 'test/resources/mocks/mock';

export const createStationInput: CreateStationInput = mock(CreateStationInput);

export const station: jest.Mocked<Station> = mock(Station);

station.owner = mock(User);

export const session = new Object({});

export const unknownError = new UnknownError();

export const deleteStationId = '1234abcd';

export const notFoundError = new StationNotFoundError();

export const deletedStation: jest.Mocked<Station> = mock(Station);

export const editStationId = '1234abcd';

export const editStationInput: EditStationInput = mock(EditStationInput);

export const toEditStation: jest.Mocked<Station> = mock(Station);

export const editedStation: jest.Mocked<Station> = mock(Station);

export const foundByIdStation: jest.Mocked<Station> = mock(Station);

export const toFindId = '1234abcd';

export const foundStations: Array<jest.Mocked<Station>> = [mock(Station), mock(Station), mock(Station)];
