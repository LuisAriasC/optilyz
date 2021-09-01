import { hash } from 'bcryptjs';
import { sign, verify } from 'jsonwebtoken';
import { config } from '../../config';
import logger from '../../lib/console-logger/logger';
import { LoginDataDTO, LoginDTO, SignupDataDTO, SignupDTO } from './dto';
import { ResponseCode, ResponseMessage } from '../../common';
import { IUser, UserService } from '../user';
import { Response } from 'express';
import { UserPayload } from '../../lib/user-payload.interface';

export class AuthService {

    private userService: UserService;

    constructor() {
        this.userService = new UserService();
    }

    public createAccessToken = (
        user: IUser
    ): string => {
        return sign({ 
                userId: user.id 
            },
            config.jwtAccessSecret,
            {
                expiresIn: '15m'
            });
      };
      
    public createRefreshToken = (
        user: IUser
    ): string => {
        return sign({ 
                userId: user.id, 
                tokenVersion: user.tokenVersion 
            },
            config.jwtRefreshSercret,
            { 
                expiresIn: '7d' 
            });
    };

    public signup = async (
        input: SignupDTO
    ): Promise<{data: SignupDataDTO, refreshToken: string} | null> => {
        try {      
            logger.silly(`Sign up user: ${JSON.stringify(input)}`);
            const user = await this.userService.signup(input)
            const accessToken = this.createAccessToken(user);
            const refreshToken = this.createRefreshToken(user);
            return {
                data: {
                    accessToken,
                    user: user.toJSON()
                },
                refreshToken
            }
        } catch (err) {
            throw new Error(err.message ? err.message : ResponseMessage.FAILURE);
        }
    };

    public login = async (
        input: LoginDTO
    ): Promise<{data: LoginDataDTO, refreshToken: string} | null> => {
        try {      
            logger.silly(`Logging in user: ${JSON.stringify(input)}`);
            const user = await this.userService.getByEmail(input.email);
            if(!user) throw new Error('Bad email.');

            const hashedPwd: string = await hash(input.password, user.salt);
            if(hashedPwd !== user.password) {
                throw new Error('Bad password.');
            }
            const accessToken = this.createAccessToken(user);
            const refreshToken = this.createRefreshToken(user);

            return {
                data: {
                    accessToken,
                    user: user.toJSON()
                },
                refreshToken
            }
        } catch (err) {
            throw new Error(err.message ? err.message : ResponseMessage.FAILURE);
        }
    };

    public refreshToken = async (
        refreshToken: string,
        res: Response,
    ) => {
        try {
            logger.silly(`Refresh token: ${refreshToken}`);
            await verify(refreshToken, config.jwtRefreshSercret, async (err: any, userPayload: UserPayload) => { 
                if (err) {
                    logger.error(`Error: ${JSON.stringify(err)}`)
                    return res.status(401).send({ 
                      code: ResponseCode.UNAUTHORIZED, 
                      message: ResponseMessage.TOKEN_EXPIRED 
                    })
                }
                const user = await this.userService.getEntityById(userPayload.userId)
                if(!user) {
                    return res.status(400).send({
                        code: ResponseCode.UNAUTHORIZED,
                        message: ResponseMessage.UNAUTHORIZED
                    })
                }
                if(user.tokenVersion !== userPayload.tokenVersion) {
                    return res.status(400).send({
                        code: ResponseCode.UNAUTHORIZED,
                        message: ResponseMessage.UNAUTHORIZED
                    })
                }
                return res.status(200)
                  .cookie('opsession', this.createRefreshToken(user), {
                    httpOnly: true,
                    path: '/refresh-token'
                  })
                  .send({
                    code: ResponseCode.SUCCESS,
                    data: {
                        accessToken: this.createAccessToken(user),
                        user: user.toJSON()
                    }
                  })
            });
        } catch (err) {
            throw new Error(err.message ? err.message : ResponseMessage.FAILURE);
        }
    };
};
