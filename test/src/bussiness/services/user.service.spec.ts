import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import configuration from 'src/infrastructure/configuration/configuration';
import { UserService } from 'src/bussiness/services/user.service';
import { IUserRepository } from 'src/bussiness/ports/output/repositories/i-user.repository';
import { mock } from 'test/resources/mocks/mock';
import { ITransactionService } from 'src/bussiness/ports/output/services/i-transaction.service';
import { MockTransactionService } from 'test/resources/mocks/bussiness/ports/output/services/mock-transaction.service';
import { IHashService } from 'src/bussiness/ports/output/services/i-hash.service';
import {
  alreadyExistsError,
  createUserInput,
  deletedUser,
  deleteUserId,
  editedUser,
  editUserId,
  editUserInput,
  foundByEmailUser,
  foundByIdUser,
  foundUsers,
  hash,
  hashedCreateUserInput,
  notFoundError,
  session,
  toEditUser,
  toFindEmail,
  toFindId,
  unknownError,
  user,
} from './data/user.service.spec.data';

describe('UserService', () => {
  let userService: UserService;
  let userRepository: jest.Mocked<IUserRepository>;
  let transactionService: jest.Mocked<ITransactionService>;
  let hashService: jest.Mocked<IHashService>;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({ isGlobal: true, load: [configuration] })],
      providers: [UserService, { provide: ITransactionService, useClass: MockTransactionService }],
    })
      .useMocker(mock)
      .compile();

    userService = app.get<UserService>(UserService);
    transactionService = app.get<jest.Mocked<ITransactionService>>(ITransactionService);
    hashService = app.get<jest.Mocked<IHashService>>(IHashService);
    userRepository = app.get<jest.Mocked<IUserRepository>>(IUserRepository);
  });

  describe('GetAll', () => {
    beforeEach(() => {
      userRepository.find.mockResolvedValue(foundUsers);
    });

    it('should return found users', async () => {
      const result = await userService.getAll(session);
      expect(result).toEqual(foundUsers);
    });

    it('should find users', async () => {
      await userService.getAll(session);
      expect(userRepository.find).toHaveBeenCalledWith({}, session);
    });

    it('should execute in transaction', async () => {
      const transaction = jest.spyOn(transactionService, 'transaction');
      await userService.getAll(session);
      expect(transaction).toHaveBeenCalled();
    });

    describe('Find users error', () => {
      beforeEach(() => {
        userRepository.find.mockRejectedValue(unknownError);
      });

      it('should fail if error on find users', async () => {
        const result = userService.getAll(session);
        await expect(result).rejects.toEqual(unknownError);
      });
    });
  });

  describe('Get', () => {
    beforeEach(() => {
      userRepository.findOneByOrFail.mockResolvedValue(foundByIdUser);
    });

    it('should return found user', async () => {
      const result = await userService.getById(toFindId, session);
      expect(result).toEqual(foundByIdUser);
    });

    it('should find user', async () => {
      await userService.getById(toFindId, session);
      expect(userRepository.findOneByOrFail).toHaveBeenCalledWith({ id: toFindId }, session);
    });

    it('should execute in transaction', async () => {
      const transaction = jest.spyOn(transactionService, 'transaction');
      await userService.getById(toFindId, session);
      expect(transaction).toHaveBeenCalled();
    });

    describe('User not found', () => {
      beforeEach(() => {
        userRepository.findOneByOrFail.mockRejectedValue(notFoundError);
      });

      it('should fail if user not found', async () => {
        const result = userService.getById(toFindId, session);
        await expect(result).rejects.toEqual(notFoundError);
      });
    });

    describe('Find user error', () => {
      beforeEach(() => {
        userRepository.findOneByOrFail.mockRejectedValue(unknownError);
      });

      it('should fail if error on find user', async () => {
        const result = userService.getById(toFindId, session);
        await expect(result).rejects.toEqual(unknownError);
      });
    });
  });

  describe('Create', () => {
    beforeEach(() => {
      userRepository.save.mockResolvedValue(user);
      hashService.hash.mockResolvedValue(hash);
    });

    it('should hash user password', async () => {
      await userService.create(createUserInput, session);
      expect(hashService.hash).toHaveBeenCalledWith(createUserInput.password);
    });

    it('should return created user', async () => {
      const result = await userService.create(createUserInput, session);
      expect(result).toEqual(user);
    });

    it('should save user', async () => {
      await userService.create(createUserInput, session);
      expect(userRepository.save).toHaveBeenCalledWith(hashedCreateUserInput, session);
    });

    it('should execute in transaction', async () => {
      const transaction = jest.spyOn(transactionService, 'transaction');
      await userService.create(createUserInput, session);
      expect(transaction).toHaveBeenCalled();
    });

    describe('User already exists', () => {
      beforeEach(() => {
        userRepository.save.mockRejectedValue(alreadyExistsError);
      });

      it('should fail if user already exists', async () => {
        const result = userService.create(createUserInput, session);
        await expect(result).rejects.toEqual(alreadyExistsError);
      });
    });

    describe('Create user error', () => {
      beforeEach(() => {
        userRepository.save.mockRejectedValue(unknownError);
      });

      it('should fail if error on save user', async () => {
        const result = userService.create(createUserInput, session);
        await expect(result).rejects.toEqual(unknownError);
      });
    });
  });

  describe('Delete', () => {
    beforeEach(() => {
      userRepository.findOneByOrFail.mockResolvedValue(deletedUser);
    });

    it('should return deleted user', async () => {
      const result = await userService.delete(deleteUserId, session);
      expect(result).toEqual(deletedUser);
    });

    it('should find to delete user', async () => {
      await userService.delete(deleteUserId, session);
      expect(userRepository.findOneByOrFail).toHaveBeenCalledWith({ id: deleteUserId }, session);
    });

    it('should delete user', async () => {
      await userService.delete(deleteUserId, session);
      expect(userRepository.deleteOneBy).toHaveBeenCalledWith({ id: deleteUserId }, session);
    });

    it('should execute in transaction', async () => {
      const transaction = jest.spyOn(transactionService, 'transaction');
      await userService.delete(deleteUserId, session);
      expect(transaction).toHaveBeenCalled();
    });

    describe('User not found on delete', () => {
      beforeEach(() => {
        userRepository.deleteOneBy.mockRejectedValue(notFoundError);
      });

      it('should fail if user not found', async () => {
        const result = userService.delete(deleteUserId, session);
        await expect(result).rejects.toEqual(notFoundError);
      });
    });

    describe('User not found on find', () => {
      beforeEach(() => {
        userRepository.findOneByOrFail.mockRejectedValue(notFoundError);
      });

      it('should fail if user not found', async () => {
        const result = userService.delete(deleteUserId, session);
        await expect(result).rejects.toEqual(notFoundError);
      });
    });

    describe('Delete user error', () => {
      beforeEach(() => {
        userRepository.deleteOneBy.mockRejectedValue(unknownError);
      });

      it('should fail if error on delete user', async () => {
        const result = userService.delete(deleteUserId, session);
        await expect(result).rejects.toEqual(unknownError);
      });
    });

    describe('Delete user error on find', () => {
      beforeEach(() => {
        userRepository.findOneByOrFail.mockRejectedValue(unknownError);
      });

      it('should fail if error on find user', async () => {
        const result = userService.delete(deleteUserId, session);
        await expect(result).rejects.toEqual(unknownError);
      });
    });
  });

  describe('Edit', () => {
    beforeEach(() => {
      userRepository.findOneByOrFail.mockResolvedValue(toEditUser);
      userRepository.updateOne.mockResolvedValue(editedUser);
    });

    it('should return edited user', async () => {
      const result = await userService.edit(editUserId, editUserInput, session);
      expect(result).toEqual(editedUser);
    });

    it('should find to edit user', async () => {
      await userService.edit(editUserId, editUserInput, session);
      expect(userRepository.findOneByOrFail).toHaveBeenCalledWith({ id: editUserId }, session);
    });

    it('should edit user', async () => {
      await userService.edit(editUserId, editUserInput, session);
      expect(toEditUser.edit).toHaveBeenCalledWith(editUserInput);
    });

    it('should save changes', async () => {
      await userService.edit(editUserId, editUserInput, session);
      expect(userRepository.updateOne).toHaveBeenCalledWith(toEditUser, session);
    });

    it('should execute in transaction', async () => {
      const transaction = jest.spyOn(transactionService, 'transaction');
      await userService.edit(editUserId, editUserInput, session);
      expect(transaction).toHaveBeenCalled();
    });

    describe('User not found on edit', () => {
      beforeEach(() => {
        userRepository.updateOne.mockRejectedValue(notFoundError);
      });

      it('should fail if user not found', async () => {
        const result = userService.edit(editUserId, editUserInput, session);
        await expect(result).rejects.toEqual(notFoundError);
      });
    });

    describe('User not found on find', () => {
      beforeEach(() => {
        userRepository.findOneByOrFail.mockRejectedValue(notFoundError);
      });

      it('should fail if user not found', async () => {
        const result = userService.edit(editUserId, editUserInput, session);
        await expect(result).rejects.toEqual(notFoundError);
      });
    });

    describe('Edit user error', () => {
      beforeEach(() => {
        userRepository.updateOne.mockRejectedValue(unknownError);
      });

      it('should fail if error on edit user', async () => {
        const result = userService.edit(editUserId, editUserInput, session);
        await expect(result).rejects.toEqual(unknownError);
      });
    });

    describe('Edit user error on find', () => {
      beforeEach(() => {
        userRepository.findOneByOrFail.mockRejectedValue(unknownError);
      });

      it('should fail if error on find user', async () => {
        const result = userService.edit(editUserId, editUserInput, session);
        await expect(result).rejects.toEqual(unknownError);
      });
    });
  });

  describe('FindOneByEmail', () => {
    beforeEach(() => {
      userRepository.findOneBy.mockResolvedValue(foundByEmailUser);
    });

    it('should return found user', async () => {
      const result = await userService.findOneByEmail(toFindEmail, session);
      expect(result).toEqual(foundByEmailUser);
    });

    it('should find user', async () => {
      await userService.findOneByEmail(toFindEmail, session);
      expect(userRepository.findOneBy).toHaveBeenCalledWith({ email: toFindEmail }, session);
    });

    it('should execute in transaction', async () => {
      const transaction = jest.spyOn(transactionService, 'transaction');
      await userService.findOneByEmail(toFindEmail, session);
      expect(transaction).toHaveBeenCalled();
    });

    describe('User not found', () => {
      beforeEach(() => {
        userRepository.findOneBy.mockResolvedValue(null);
      });

      it('should return null if user not found', async () => {
        const result = await userService.findOneByEmail(toFindEmail, session);
        expect(result).toBeNull();
      });
    });

    describe('Find user error', () => {
      beforeEach(() => {
        userRepository.findOneBy.mockRejectedValue(unknownError);
      });

      it('should fail if error on find user', async () => {
        const result = userService.findOneByEmail(toFindEmail, session);
        await expect(result).rejects.toEqual(unknownError);
      });
    });
  });
});
