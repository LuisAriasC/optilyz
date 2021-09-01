import { Request, RequestHandler, Response } from 'express';
import { AddTaskDTO, TaskResponseDTO, TasksResponseDTO, SearchTaskDTO, UpdateTaskDTO } from './dto';
import { ErrorMessage, ResponseCode, ResponseMessage } from '../../common';
import { UserResponseDTO } from '../user';
import { TaskService } from './task.service';

export class TaskController {

  private taskService: TaskService;

  constructor() {
    this.taskService = new TaskService();
  }

  public add: RequestHandler = async (
    req: Request<{}, {}, AddTaskDTO>, 
    res: Response<TaskResponseDTO>
  ) => {
    try {
      const task = await this.taskService.add(req.body)
      return res.status(200).send({ 
        code: ResponseCode.SUCCESS,
        data: { task }
      });
    } catch (err) {
      return res.status(400).send({
        code: ResponseCode.FAILURE,
        message: err.message ? err.message : ResponseMessage.FAILURE
      })
    }
  };

  public get: RequestHandler = async (
    req: Request<{ taskId: string }, {}, {}>, 
    res: Response<TaskResponseDTO>
  ) => {
    try {
      const { taskId } = req.params;    
      const task = await this.taskService.getById(taskId);
      if (!task) {
        return res.status(404).send({
          code: ResponseCode.NOT_FOUND,
          message: ErrorMessage.TASK_NOT_FOUND
        });
      }
      return res.status(200).send({ 
        code: ResponseCode.SUCCESS,
        data: { task }
      });
    } catch (err) {
      return res.status(400).send({
        code: ResponseCode.FAILURE,
        message: err.message ? err.message : ResponseMessage.FAILURE
      })
    }
  };

  public update: RequestHandler = async (
    req: Request<{ taskId: string }, {}, UpdateTaskDTO>, 
    res: Response<TaskResponseDTO>
  ) => {
    try {
      const { taskId } = req.params;
      const task = await this.taskService.update(taskId, req.body);
      if (!task) {
        return res.status(404).send({
          code: ResponseCode.NOT_FOUND,
          message: ErrorMessage.TASK_NOT_FOUND
        });
      } 
      return res.send({
        code: ResponseCode.SUCCESS, 
        data: { task } 
      });
    } catch (err) {
      return res.status(400).send({
        code: ResponseCode.FAILURE,
        message: err.message ? err.message : ResponseMessage.FAILURE
      })
    }
  };

  public remove: RequestHandler = async (
    req: Request<{ taskId: string }, {}, {}>, 
    res: Response<TaskResponseDTO>
  ) => {
    try {
      const { taskId } = req.params;
      const task = await this.taskService.remove(taskId);
      if (!task) {
        return res.status(404).send({
          code: ResponseCode.NOT_FOUND,
          message: ErrorMessage.TASK_NOT_FOUND
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
    req: Request<{}, {}, {}, SearchTaskDTO>, 
    res: Response<TasksResponseDTO>
  ) => {  
    try {
      const { description } = req.query;
      const tasks = await this.taskService.search(description);
      return res.send({
        code: ResponseCode.SUCCESS,
        data: { tasks }
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
    res: Response<TasksResponseDTO>
  ) => {
    try {
      const tasks = await this.taskService.all();
      return res.send({
        code: ResponseCode.SUCCESS,
        data: { tasks }
      });
    } catch (err) {
      return res.status(400).send({
        code: ResponseCode.FAILURE,
        message: err.message ? err.message : ResponseMessage.FAILURE
      })
    }
  };

  public userByTask: RequestHandler = async (
    req: Request<{ taskId: string }, {}, {}>, 
    res: Response<UserResponseDTO>
  ) => {
    try {
      const { taskId } = req.params;
      const user = await this.taskService.userByTask(taskId)
      if (!user) {
        return res.status(404).send({
          code: ResponseCode.NOT_FOUND,
          message: ErrorMessage.TASK_NOT_FOUND
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
}
