import { Request, RequestHandler, Response } from 'express';
import { LoginDTO, RefreshTokenResponseDTO, SignupDTO, SignupResponseDTO } from './dto';
import { ResponseCode, ResponseMessage } from '../../common';
import { AuthService } from './auth.service';
import { ResponseDTO } from '../../lib/dto/response.dto';

export class AuthController {

  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  public signup: RequestHandler = async (
    req: Request<{}, {}, SignupDTO>, 
    res: Response<SignupResponseDTO>
  ) => {
    try {
      const auth = await this.authService.signup(req.body)
      return res.status(200)
       .cookie('opsession', auth.refreshToken, {
         httpOnly: true,
         path: '/refresh-token'
       })
       .send({ 
        code: ResponseCode.SUCCESS,
        data: auth.data 
       });
    } catch (err) {
      return res.status(400).send({
        code: err.code ? err.code : ResponseCode.FAILURE,
        message: err.message ? err.message : ResponseMessage.FAILURE
      })
    }
  };

  public login: RequestHandler = async (
    req: Request<{}, {}, LoginDTO>, 
    res: Response<SignupResponseDTO>
  ) => {
    try {
      const auth = await this.authService.login(req.body)
      return res.status(200)
       .cookie('opsession', auth.refreshToken, {
         httpOnly: true,
         path: '/refresh-token'
       })
       .send({ 
        code: ResponseCode.SUCCESS,
        data: auth.data 
       });
    } catch (err) {
      return res.status(400).send({
        code: err.code ? err.code : ResponseCode.FAILURE,
        message: err.message ? err.message : ResponseMessage.FAILURE
      })
    }
  };

  public logout: RequestHandler = async (
    req: Request<{}, {}, {}>,
    res: Response
  ) => {
    try {
      return res.status(200)
       .cookie('opsession', '', {
         httpOnly: true,
         path: '/refresh-token'
       })
       .send({ code: ResponseCode.SUCCESS });
    } catch (err) {
      return res.status(400).send({
        code: err.code ? err.code : ResponseCode.FAILURE,
        message: err.message ? err.message : ResponseMessage.FAILURE
      })
    }
  };

  public refreshToken: RequestHandler = async (
    req: Request<{}, {}, SignupDTO>, 
    res: Response<RefreshTokenResponseDTO>
  ) => {
    try {
      const token = req.cookies.opsession;
      if (!token) {
        return res.status(200)
         .send({ 
           code: ResponseCode.FAILURE,
           message: ResponseMessage.MISSING_REFRESH_TOKEN
         });
      }
      return this.authService.refreshToken(token, res)
    } catch (err) {
      return res.status(400).send({
        code: err.code ? err.code : ResponseCode.FAILURE,
        message: err.message ? err.message : ResponseMessage.FAILURE
      })
    }
  };
}
