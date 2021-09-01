import { ResponseDTO } from '../../../../lib/dto/response.dto';
import { SignupDataDTO } from './signup-data.dto';

export interface SignupResponseDTO extends ResponseDTO<SignupDataDTO> {}
