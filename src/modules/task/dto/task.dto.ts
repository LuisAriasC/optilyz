import { UserDTO } from '../../user/dto';

export interface TaskDTO {
    id?: string;
    description: string;
    finishTime: number;
    notificationTime: number;
    isCompleted: boolean;
    user?: UserDTO | string;
    createdAt: number;
    updatedAt: number;
}
