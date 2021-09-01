import { ResponseDTO } from '../../../../lib/dto/response.dto';
import { UserDataDTO } from './user-data.dto';

export interface UserResponseDTO extends ResponseDTO<UserDataDTO> {}
