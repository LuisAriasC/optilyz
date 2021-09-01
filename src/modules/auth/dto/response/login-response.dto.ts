import { ResponseDTO } from '../../../../lib/dto/response.dto';
import { LoginDataDTO } from './login-data.dto';

export interface LoginResponseDTO extends ResponseDTO<LoginDataDTO> {}
