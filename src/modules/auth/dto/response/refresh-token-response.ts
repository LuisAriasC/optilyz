import { ResponseDTO } from '../../../../lib/dto/response.dto';
import { RefreshTokenDataDTO } from './refresh-token-data.dto';

export interface RefreshTokenResponseDTO extends ResponseDTO<RefreshTokenDataDTO> {}
