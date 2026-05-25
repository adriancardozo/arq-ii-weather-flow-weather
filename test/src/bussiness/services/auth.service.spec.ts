import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import configuration from 'src/infrastructure/configuration/configuration';
import { AuthService } from 'src/bussiness/services/auth.service';
import { mock } from 'test/resources/mocks/mock';
import { ITransactionService } from 'src/bussiness/ports/output/services/i-transaction.service';
import { MockTransactionService } from 'test/resources/mocks/bussiness/ports/output/services/mock-transaction.service';
import {
  registeredUser,
  createUserInput,
  user,
  session,
  alreadyExistsError,
  unknownError,
  registeredUserAccessToken,
  registeredUserLoginInput,
  loginAccessToken,
  loginUserLoginInput,
  loginUser,
  toValidateEmail,
  toValidatePassword,
  toValidateFoundUser,
  plainLoginUserLoginInput,
  plainRegisteredUserLoginInput,
} from './data/auth.service.spec.data';
import { UserService } from 'src/bussiness/services/user.service';
import { JwtService } from '@nestjs/jwt';
import { TokenOutput } from 'src/bussiness/ports/input/services/dtos/output/token.output';
import { IHashService } from 'src/bussiness/ports/output/services/i-hash.service';

describe('AuthService', () => {
  let authService: AuthService;
  let userService: jest.Mocked<UserService>;
  let transactionService: jest.Mocked<ITransactionService>;
  let jwtService: jest.Mocked<JwtService>;
  let hashService: jest.Mocked<IHashService>;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({ isGlobal: true, load: [configuration] })],
      providers: [AuthService, { provide: ITransactionService, useClass: MockTransactionService }],
    })
      .useMocker(mock)
      .compile();

    authService = app.get<AuthService>(AuthService);
    userService = app.get<jest.Mocked<UserService>>(UserService);
    transactionService = app.get<jest.Mocked<ITransactionService>>(ITransactionService);
    jwtService = app.get<jest.Mocked<JwtService>>(JwtService);
    hashService = app.get<jest.Mocked<IHashService>>(IHashService);
  });

  describe('Profile', () => {
    it('should return user argument', () => {
      const result = authService.profile(user);
      expect(result).toEqual(user);
    });
  });

  describe('Register', () => {
    beforeEach(() => {
      userService.create.mockResolvedValue(registeredUser);
      jwtService.signAsync.mockResolvedValue(registeredUserAccessToken);
      registeredUser.loginInput.mockReturnValue(registeredUserLoginInput);
      registeredUserLoginInput.plain.mockReturnValue(plainRegisteredUserLoginInput);
    });

    it('should return registered user access token', async () => {
      const result = await authService.register(createUserInput, session);
      expect(result).toEqual(new TokenOutput(registeredUserAccessToken));
    });

    it('should get registered user access token', async () => {
      await authService.register(createUserInput, session);
      expect(jwtService.signAsync).toHaveBeenCalledWith(plainRegisteredUserLoginInput);
    });

    it('should get registered user login input', async () => {
      await authService.register(createUserInput, session);
      expect(registeredUser.loginInput).toHaveBeenCalled();
    });

    it('should create user', async () => {
      await authService.register(createUserInput, session);
      expect(userService.create).toHaveBeenCalledWith(createUserInput, session);
    });

    it('should execute in transaction', async () => {
      const transaction = jest.spyOn(transactionService, 'transaction');
      await authService.register(createUserInput, session);
      expect(transaction).toHaveBeenCalled();
    });

    describe('User already exists', () => {
      beforeEach(() => {
        userService.create.mockRejectedValue(alreadyExistsError);
      });

      it('should fail if user already exists', async () => {
        const result = authService.register(createUserInput, session);
        await expect(result).rejects.toEqual(alreadyExistsError);
      });
    });

    describe('Create user error', () => {
      beforeEach(() => {
        userService.create.mockRejectedValue(unknownError);
      });

      it('should fail if error on create user', async () => {
        const result = authService.register(createUserInput, session);
        await expect(result).rejects.toEqual(unknownError);
      });
    });
  });

  describe('Login', () => {
    beforeEach(() => {
      jwtService.signAsync.mockResolvedValue(loginAccessToken);
      loginUser.loginInput.mockReturnValue(loginUserLoginInput);
      loginUserLoginInput.plain.mockReturnValue(plainLoginUserLoginInput);
    });

    it('should return user access token', async () => {
      const result = await authService.login(loginUser);
      expect(result).toEqual(new TokenOutput(loginAccessToken));
    });

    it('should get user access token', async () => {
      await authService.login(loginUser);
      expect(jwtService.signAsync).toHaveBeenCalledWith(plainLoginUserLoginInput);
    });

    it('should get user login input', async () => {
      await authService.login(loginUser);
      expect(loginUser.loginInput).toHaveBeenCalled();
    });
  });

  describe('Validate', () => {
    beforeEach(() => {});

    it('should get user', async () => {
      await authService.validate(toValidateEmail, toValidatePassword);
      expect(userService.findOneByEmail).toHaveBeenCalledWith(toValidateEmail);
    });

    describe('User found', () => {
      beforeEach(() => {
        userService.findOneByEmail.mockResolvedValue(toValidateFoundUser);
      });

      it('should validate password', async () => {
        await authService.validate(toValidateEmail, toValidatePassword);
        expect(hashService.compare).toHaveBeenCalledWith(toValidatePassword, toValidateFoundUser.password);
      });

      describe('Password matches', () => {
        beforeEach(() => {
          hashService.compare.mockReturnValue(true);
        });

        it('should return user', async () => {
          const result = await authService.validate(toValidateEmail, toValidatePassword);
          expect(result).toEqual(toValidateFoundUser);
        });
      });

      describe('Password not matches', () => {
        beforeEach(() => {
          hashService.compare.mockReturnValue(false);
        });

        it('should return null', async () => {
          const result = await authService.validate(toValidateEmail, toValidatePassword);
          expect(result).toBeNull();
        });
      });
    });

    describe('User not found', () => {
      beforeEach(() => {
        userService.findOneByEmail.mockResolvedValue(null);
      });

      it('should return null', async () => {
        const result = await authService.validate(toValidateEmail, toValidatePassword);
        expect(result).toBeNull();
      });
    });
  });
});
