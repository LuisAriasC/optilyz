import { UserDTO } from '../../../user';

export interface LoginDataDTO {
    accessToken: string;
    user: UserDTO;
}
