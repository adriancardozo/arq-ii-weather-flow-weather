import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { App } from 'supertest/types';
import { HttpModule, HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import {
  createDto,
  headers,
  loginDto,
  mongoUri,
  registerDto,
  usersUrl,
  url,
  createUserDto,
} from './data/station.e2e-spec.data';
import { getConnectionToken, MongooseModule } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

describe('StationController (e2e)', () => {
  let app: INestApplication<App>;
  let httpService: HttpService;
  let token: string;
  let userId: string;
  let stationId: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [HttpModule, MongooseModule.forRoot(mongoUri)],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    httpService = app.get(HttpService);

    const connection = app.get<Connection>(getConnectionToken());
    const collections = await connection.listCollections();
    for (const { name } of collections) {
      const collection = connection.collection(name);
      await collection.deleteMany({});
    }

    try {
      await firstValueFrom(httpService.post(`${usersUrl}/auth/register`, registerDto));
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      /* */
    }

    token = (await firstValueFrom(httpService.post(`${usersUrl}/auth/login`, loginDto))).data.access_token;
    userId = (await firstValueFrom(httpService.get(`${usersUrl}/auth/profile`, headers(token)))).data.id;
    stationId = (await firstValueFrom(httpService.post(`${url}/station`, createDto(userId)))).data.id;
  });

  describe('Station interaction with Users microservice', () => {
    it('should add station to owner user /station (POST)', async () => {
      const {
        data: { id: station },
      } = await firstValueFrom(httpService.post(`${url}/station`, createDto(userId)));
      const { data: user } = await firstValueFrom(
        httpService.get(`${usersUrl}/auth/profile`, headers(token)),
      );
      expect(user.stations).toContain(station);
    });

    it('should delete station from owner user /station/:id (DELETE)', async () => {
      const {
        data: { id: station },
      } = await firstValueFrom(httpService.delete(`${url}/station/${stationId}`));
      const { data: user } = await firstValueFrom(
        httpService.get(`${usersUrl}/auth/profile`, headers(token)),
      );
      expect(user.stations).not.toContain(station);
    });

    it('should delete station from old user /station/:id (PATCH)', async () => {
      const {
        data: { id: newUserId },
      } = await firstValueFrom(httpService.post(`${usersUrl}/user`, createUserDto(), headers(token)));
      const {
        data: { id: station },
      } = await firstValueFrom(httpService.patch(`${url}/station/${stationId}`, { owner_id: newUserId }));
      const { data: user } = await firstValueFrom(
        httpService.get(`${usersUrl}/auth/profile`, headers(token)),
      );
      expect(user.stations).not.toContain(station);
    });

    it('should add station to new user /station/:id (PATCH)', async () => {
      const {
        data: { id: newUserId },
      } = await firstValueFrom(httpService.post(`${usersUrl}/user`, createUserDto(), headers(token)));
      const {
        data: { id: station },
      } = await firstValueFrom(httpService.patch(`${url}/station/${stationId}`, { owner_id: newUserId }));
      const { data: newUser } = await firstValueFrom(
        httpService.get(`${usersUrl}/user/${newUserId}`, headers(token)),
      );
      expect(newUser.stations).toContain(station);
    });
  });

  afterEach(async () => {
    await app.close();
  });
});
