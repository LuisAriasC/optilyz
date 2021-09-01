import { ResponseDTO } from '../../../../lib/dto/response.dto';
import { UsersDataDTO } from './users-data.dto';

export interface UsersResponseDTO extends ResponseDTO<UsersDataDTO> {}
