import { Request } from 'express';
import { User } from 'src/bussiness/entities/user.entity';

export type UserRequest = Request & { user: User };
