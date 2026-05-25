import { User } from 'src/bussiness/entities/user.entity';
import {
  editEmailInput,
  editFirstNameInput,
  editLastNameInput,
  emptyInput,
  originalEmail,
  originalFirstName,
  originalId,
  originalLastName,
  originalPassword,
} from './data/user.entity.spec.data';

describe('User', () => {
  let user: User;

  beforeEach(() => {
    user = new User(originalId, originalFirstName, originalLastName, originalEmail, originalPassword);
  });

  describe('Edit', () => {
    describe('First Name', () => {
      describe('Is present', () => {
        it('should change first name', () => {
          user.edit(editFirstNameInput);
          expect(user.firstName).toEqual(editFirstNameInput.firstName);
        });
      });

      describe('Is not present', () => {
        it("shouldn't change first name", () => {
          user.edit(emptyInput);
          expect(user.firstName).toEqual(originalFirstName);
        });
      });
    });

    describe('Last Name', () => {
      describe('Is present', () => {
        it('should change last name', () => {
          user.edit(editLastNameInput);
          expect(user.lastName).toEqual(editLastNameInput.lastName);
        });
      });

      describe('Is not present', () => {
        it("shouldn't change last name", () => {
          user.edit(emptyInput);
          expect(user.lastName).toEqual(originalLastName);
        });
      });
    });

    describe('Email', () => {
      describe('Is present', () => {
        it('should change email', () => {
          user.edit(editEmailInput);
          expect(user.email).toEqual(editEmailInput.email);
        });
      });

      describe('Is not present', () => {
        it("shouldn't change email", () => {
          user.edit(emptyInput);
          expect(user.email).toEqual(originalEmail);
        });
      });
    });
  });
});
