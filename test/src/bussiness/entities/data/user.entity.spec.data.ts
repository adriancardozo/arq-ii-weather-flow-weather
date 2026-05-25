import { EditUserInput } from 'src/bussiness/ports/input/services/dtos/input/edit-user.input';

export const originalId = '1234abcd';

export const originalFirstName = 'Juan';

export const originalLastName = 'Pérez';

export const originalEmail = 'juanperez@mail.com';

export const originalPassword = 'Juanperez1234!';

export const emptyInput = new EditUserInput();

export const editFirstNameInput = new EditUserInput('Nuevojuan');

export const editLastNameInput = new EditUserInput(undefined, 'Nuevopérez');

export const editEmailInput = new EditUserInput(undefined, undefined, 'nuevojuanperez@mail.com');
