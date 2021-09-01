import { Request, RequestHandler, Response } from 'express';
import { AddUserDTO, UserResponseDTO, UsersResponseDTO, SearchUsersDTO, UpdateUserDTO } from './dto';
import { ErrorMessage, ResponseCode, ResponseMessage } from '../../common';
import { TasksResponseDTO } from '../task';
import { UserService } from './user.service';

export class UserController {
  
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  public add: RequestHandler = async (
    req: Request<{}, {}, AddUserDTO>, 
    res: Response<UserResponseDTO>
  ) => {
    try {
      const user = await this.userService.add(req.body)
    
      return res.status(200).send({ 
        code: ResponseCode.SUCCESS,
        data: { user }
      });
    } catch (err) {
      return res.status(400).send({
        code: ResponseCode.FAILURE,
        message: err.message ? err.message : ResponseMessage.FAILURE
      })
    }
  };

  public get: RequestHandler = async (
    req: Request<{ userId: string }, {}, {}>, 
    res: Response<UserResponseDTO>
  ) => {
    try {
      const { userId } = req.params;
      const user = await this.userService.getById(userId)
      if (!user) {
        return res.status(404).send({
          code: ResponseCode.NOT_FOUND,
          message: ErrorMessage.USER_NOT_FOUND
        });
      }
    
      return res.status(200).send({ 
        code: ResponseCode.SUCCESS,
        data: { user }
      });
    } catch (err) {
      return res.status(400).send({
        code: ResponseCode.FAILURE,
        message: err.message ? err.message : ResponseMessage.FAILURE
      })
    }
  };

  public update: RequestHandler = async (
    req: Request<{ userId: string }, {}, UpdateUserDTO>, 
    res: Response<UserResponseDTO>
  ) => {
    try {
        const { userId } = req.params;
        const user = await this.userService.update(userId, req.body)
        if (!user) {
          return res.status(404).send({
            code: ResponseCode.NOT_FOUND,
            message: ErrorMessage.USER_NOT_FOUND
          });
        }
          
        return res.send({
          code: ResponseCode.SUCCESS, 
          data: { user } 
        });
    } catch (err) {
      return res.status(400).send({
        code: ResponseCode.FAILURE,
        message: err.message ? err.message : ResponseMessage.FAILURE
      })
    }
  };

  public remove: RequestHandler = async (
    req: Request<{ userId: string }, {}, {}>, 
    res: Response<UserResponseDTO>
  ) => {
    try {
      const { userId } = req.params;
      const user = await this.userService.remove(userId);
      if (!user) {
        return res.status(404).send({
          code: ResponseCode.NOT_FOUND,
          message: ErrorMessage.USER_NOT_FOUND
        });
      }
      return res.status(200).send({
        code: ResponseCode.SUCCESS
      });
    } catch (err) {
      return res.status(400).send({
        code: ResponseCode.FAILURE,
        message: err.message ? err.message : ResponseMessage.FAILURE
      })
    }
  };

  public search: RequestHandler = async (
    req: Request<{}, {}, {}, SearchUsersDTO>, 
    res: Response<UsersResponseDTO>
  ) => {  
    try {
      const { name, email } = req.query;
      const users = await this.userService.search(name, email);
      return res.send({
        code: ResponseCode.SUCCESS,
        data: { users }
      });
    } catch (err) {
      return res.status(400).send({
        code: ResponseCode.FAILURE,
        message: err.message ? err.message : ResponseMessage.FAILURE
      })
    }
  };

  public all: RequestHandler = async (
    req: Request<{}, {}, {}>, 
    res: Response<UsersResponseDTO>
  ) => {
    try {
      const users = await this.userService.all()
      return res.send({
        code: ResponseCode.SUCCESS,
        data: { users }
      });
    } catch (err) {
      return res.status(400).send({
        code: ResponseCode.FAILURE,
        message: err.message ? err.message : ResponseMessage.FAILURE
      })
    }
  };

  public tasksByUser: RequestHandler = async (
    req: Request<{ userId: string }, {}, {}>, 
    res: Response<TasksResponseDTO>
  ) => {
    try {
      const { userId } = req.params;
      const tasks = await this.userService.tasksByUser(userId)
      if (!tasks) {
        return res.status(404).send({
          code: ResponseCode.NOT_FOUND,
          message: ErrorMessage.USER_NOT_FOUND
        });
      }
      return res.status(200).send({
        code: ResponseCode.SUCCESS,
        data: { tasks }
      });
    } catch (err) {
      res.status(400).send({
        code: ResponseCode.FAILURE,
        message: err.message ? err.message : ResponseMessage.FAILURE
      })
    }
  };
}
