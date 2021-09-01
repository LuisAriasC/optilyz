import { Request } from 'express'
import { UserPayload } from './user-payload.interface';

export interface IContext extends Request {
    user: UserPayload;
}
