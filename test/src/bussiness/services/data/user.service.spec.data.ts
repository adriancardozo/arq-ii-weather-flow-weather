import { User } from 'src/bussiness/entities/user.entity';
import { UnknownError } from 'src/bussiness/errors/unknown.error';
import { UserAlreadyExistsError } from 'src/bussiness/errors/user-already-exists.error';
import { UserNotFoundError } from 'src/bussiness/errors/user-not-found.error';
import { CreateUserInput } from 'src/bussiness/ports/input/services/dtos/input/create-user.input';
import { EditUserInput } from 'src/bussiness/ports/input/services/dtos/input/edit-user.input';
import { mock } from 'test/resources/mocks/mock';

export const hash = '#hash#';

export const createUserInput: CreateUserInput = {
  firstName: 'Juan',
  lastName: 'Perez',
  email: 'juanperez@mail.com',
  password: 'Juanperez1234!',
};

export const user: jest.Mocked<User> = mock(User);

export const hashedCreateUserInput = { ...createUserInput, password: hash };

export const session = new Object({});

export const alreadyExistsError = new UserAlreadyExistsError();

export const unknownError = new UnknownError();

export const deleteUserId = '1234abcd';

export const notFoundError = new UserNotFoundError();

export const deletedUser: jest.Mocked<User> = mock(User);

deletedUser.stations = [];

export const editUserId = '1234abcd';

export const editUserInput: EditUserInput = {
  firstName: 'Juan',
  lastName: 'Perez',
  email: 'juanperez@mail.com',
};

export const toEditUser: jest.Mocked<User> = mock(User);

export const editedUser: jest.Mocked<User> = mock(User);

export const toFindEmail = 'juanperez@mail.com';

export const foundByEmailUser: jest.Mocked<User> = mock(User);

export const foundByIdUser: jest.Mocked<User> = mock(User);

export const toFindId = '1234abcd';

export const foundUsers: Array<jest.Mocked<User>> = [mock(User), mock(User), mock(User)];
