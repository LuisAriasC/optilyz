import { UserDTO } from '../../../user';

export interface RefreshTokenDataDTO {
    accessToken: string;
    user: UserDTO;
}
