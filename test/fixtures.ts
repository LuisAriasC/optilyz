/* eslint-disable no-underscore-dangle,@typescript-eslint/no-unsafe-assignment */
import { hash, genSalt } from 'bcryptjs';
import { Types } from 'mongoose';
import { UserDTO } from '../src/modules/user';
import User from '../src/modules/user/user';
import { TaskDTO } from '../src/modules/task';
import Task from '../src/modules/task/task';

export const USERS: UserDTO[] = [
    {
        name: 'Test User',
        email: 'test.user@mail.com',
        password: 'test_password',
    }
]

export const TASKS: TaskDTO[] = [
    {
        description: 'First Task',
        finishTime: 1629937778450,
        notificationTime: 1629997778450,
        isCompleted: false,
        user: '',
        createdAt: new Date().getTime(),
        updatedAt: new Date().getTime(),
    },
    {
        description: 'Second Task',
        finishTime: 1629937778450,
        notificationTime: 1629997778450,
        isCompleted: false,
        user: '',
        createdAt: new Date().getTime(),
        updatedAt: new Date().getTime(),
    },
];

export const init = async (): Promise<void> => {

    const users = await Promise.all(USERS.map( async ({password, ...data }) => {
        const salt: string = await genSalt(12);
        const hashedPwd: string = await hash(password, salt);
        const user = await new User({_id: Types.ObjectId().toHexString(), password: hashedPwd, salt: salt, ...data });
        await user.save();
        return user.toJSON();
    }));

    const tasks = await Promise.all(TASKS.map( async ({user, ...data}) => {
        const task = await new Task({ _id: Types.ObjectId().toHexString(), user: users[0]._id, ...data }).populate('user');
        await task.save();
        return task.toJSON();
    }));
};
