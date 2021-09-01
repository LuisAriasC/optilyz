import { ResponseDTO } from '../../../../lib/dto/response.dto';
import { TaskDataDTO } from './task-data.dto';

export interface TaskResponseDTO extends ResponseDTO<TaskDataDTO> {}
