import Task from './task';
import logger from '../../lib/console-logger/logger';
import { AddTaskDTO, TaskDTO, UpdateTaskDTO } from './dto';
import { ResponseMessage } from '../../common';
import { UserDTO } from '../user';

export class TaskService {
    constructor() {}

    public add = async (
        input: AddTaskDTO
    ): Promise<TaskDTO> => {
        try {      
            logger.silly(`Save task: ${JSON.stringify(input)}`)
            const task = new Task({ ...input, isCompleted: false }).populate('user');
            await task.save();
            return task.toJSON()
        } catch (err) {
            throw new Error(err.message ? err.message : ResponseMessage.FAILURE);
        }
    };

    public getById = async (
        taskId: string
    ): Promise<TaskDTO | null> => {
        try {
            logger.silly(`Task to get: ${taskId}`);
            const task = await Task.findById(taskId);
            if (!task) return null;
            return task.toJSON()
        } catch (err) {
            throw new Error(err.message ? err.message : ResponseMessage.FAILURE);
        }
    };

    public update = async (
        taskId: string, 
        update: UpdateTaskDTO
    ): Promise<TaskDTO | null> => {
        try {
            logger.silly(`Task to update: ${taskId} with data ${JSON.stringify(update)}`);
            const task = await Task.findByIdAndUpdate(taskId, update);
            if (!task) return null;
            return task.toJSON()
        } catch (err) {
            throw new Error(err.message ? err.message : ResponseMessage.FAILURE);
        }
    };

    public remove = async (
        taskId: string
    ): Promise<boolean> => {
        try {      
            const task = await Task.findById(taskId);
            if (!task) return false      
            logger.silly(`Delete task with id: ${taskId}`)
            await task.delete();
            return true;
        } catch (err) {
            throw new Error(err.message ? err.message : ResponseMessage.FAILURE);
        }
    };

    private buildTaskSeachQuery = (description?: string): { [key: string]: any } => {
        const query: any = {};
        if (description) {
          query.description = new RegExp(`.*${description}.*`, 'i');
        }
      
        return query;
    };
      
    public search = async (
        description?: string
    ): Promise<Array<TaskDTO>> => {  
        try {      
            logger.silly(`Search tasks`);
            const query = this.buildTaskSeachQuery(description);
            const tasks = await Task.find(query);
            return tasks.map(t => t.toJSON());
        } catch (err) {
            throw new Error(err.message ? err.message : ResponseMessage.FAILURE);
        }
    };

    public all = async (): Promise<Array<TaskDTO>> => {
        try {
          logger.silly('Find all tasks');
          const tasks = await Task.find();
          return tasks.map(t => t.toJSON());
        } catch (err) {
            throw new Error(err.message ? err.message : ResponseMessage.FAILURE);

        }
    };

    public userByTask = async (
        taskId: string
    ): Promise<UserDTO | null> => {
        try {
            logger.silly(`Get task from task: ${taskId}`);        
            const task = await Task.findById(taskId).populate('user');
            if (!task) {
                return null;
            }
            return task.user.toJSON();
        } catch (err) {
            throw new Error(err.message ? err.message : ResponseMessage.FAILURE);
        }
    };
};
