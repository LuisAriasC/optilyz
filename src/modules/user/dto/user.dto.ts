import { TaskDTO } from '../../task/dto/task.dto';

export interface UserDTO {
    id?: string;
    name: string;
    email: string;
    password?: string;
    salt?: string;
    tasks?: TaskDTO[];
    createdAt?: number;
    updatedAt?: number;
}
