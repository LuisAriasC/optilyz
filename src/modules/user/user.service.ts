import { hash, genSalt } from 'bcryptjs';
import User, { IUser } from './user';
import logger from '../../lib/console-logger/logger';
import { AddUserDTO, UserDTO, UpdateUserDTO } from './dto';
import { ResponseMessage } from '../../common';
import { TaskDTO } from '../task';
import { IUpdateUser } from './interfaces';

export class UserService {
    constructor() {}

    public add = async (
        input: AddUserDTO
    ): Promise<UserDTO> => {
        try {      
            logger.silly(`Save user: ${JSON.stringify(input)}`)
            /** Generate salt for password hashing */
            const salt: string = await genSalt(12);
            const hashedPwd: string = await hash(input.password, salt);

            const user = new User({ ...input, password: hashedPwd, salt: salt, tokenVersion: 1 }).populate('tasks');
            await user.save();
            return user.toJSON()
        } catch (err) {
            throw new Error(err.message ? err.message : ResponseMessage.FAILURE);
        }
    };

    public getById = async (
        userId: string
    ): Promise<UserDTO | null> => {
        try {
            logger.silly(`User to get: ${userId}`);
            const user = await User.findById(userId);
            if (!user) return null;
            return user.toJSON()
        } catch (err) {
            throw new Error(err.message ? err.message : ResponseMessage.FAILURE);
        }
    };

    public getEntityById = async (
        userId: string
    ): Promise<IUser | null> => {
        try {
            logger.silly(`User to get: ${userId}`);
            const user = await User.findById(userId);
            if (!user) return null;
            return user
        } catch (err) {
            throw new Error(err.message ? err.message : ResponseMessage.FAILURE);
        }
    };

    public update = async (
        userId: string, 
        update: UpdateUserDTO
    ): Promise<UserDTO | null> => {
        try {
            logger.silly(`User to update: ${userId} with data ${JSON.stringify(update)}`);
            const update_: IUpdateUser = update;

            if(update_.password) {
                /** Generate salt for password hashing */
                const salt: string = await genSalt(12);
                const hashedPwd: string = await hash(update.password, salt);
                update_.salt = salt;
                update_.password = hashedPwd; 
            }

            const user = await User.findByIdAndUpdate(userId, update_);
            if (!user) return null;
            return user.toJSON()
        } catch (err) {
            throw new Error(err.message ? err.message : ResponseMessage.FAILURE);
        }
    };

    public remove = async (
        userId: string
    ): Promise<boolean> => {
        try {      
            const user = await User.findById(userId);
            if (!user) return false      
            logger.silly(`Delete user with id: ${userId}`)
            await user.delete();
            return true;
        } catch (err) {
            throw new Error(err.message ? err.message : ResponseMessage.FAILURE);
        }
    };

    private buildUserSeachQuery = (name?: string, email?: string): { [key: string]: any } => {
        const query: any = {};
        if (name) {
          query.name = new RegExp(`.*${name}.*`, 'i');
        }
        if (email) {
            query.email = new RegExp(`.*${email}.*`, 'i');
        }
      
        return query;
    };
      
    public search = async (
        name?: string,
        email?: string
    ): Promise<Array<UserDTO>> => {  
        try {      
            logger.silly(`Search users`);
            const query = this.buildUserSeachQuery(name, email);
            const users = await User.find(query);
            return users.map(t => t.toJSON());
        } catch (err) {
            throw new Error(err.message ? err.message : ResponseMessage.FAILURE);
        }
    };

    public all = async (): Promise<Array<UserDTO>> => {
        try {
          logger.silly('Find all users');
          const users = await User.find();
          return users.map(t => t.toJSON());
        } catch (err) {
            throw new Error(err.message ? err.message : ResponseMessage.FAILURE);

        }
    };

    public tasksByUser = async (
        userId: string
    ): Promise<Array<TaskDTO> | null> => {
        try {
            logger.silly(`Get user from user: ${userId}`);        
            const user = await User.findById(userId).populate('user');
            if (!user) {
                return null;
            }
            return user.tasks.map(t => t.toJSON());
        } catch (err) {
            throw new Error(err.message ? err.message : ResponseMessage.FAILURE);
        }
    };

    public signup = async (
        input: AddUserDTO
    ): Promise<IUser> => {
        try {      
            const salt: string = await genSalt(12);
            const hashedPwd: string = await hash(input.password, salt);
            const user = new User({ ...input, password: hashedPwd, salt: salt, tokenVersion: 1 }).populate('tasks');
            await user.save();
            return user
        } catch (err) {
            throw new Error(err.message ? err.message : ResponseMessage.FAILURE);
        }
    };

    public getByEmail = async (
        email: string
    ): Promise<IUser | null> => {
        try {
            logger.silly(`Find user with email: ${email}`);
            const user = await User.findOne({ email });
            if (!user) return null;
            return user;
        } catch (err) {
            throw new Error(err.message ? err.message : ResponseMessage.FAILURE);
        }
    };
};
