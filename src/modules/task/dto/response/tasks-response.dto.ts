import { ResponseDTO } from '../../../../lib/dto/response.dto';
import { TasksDataDTO } from './tasks-data.dto';

export interface TasksResponseDTO extends ResponseDTO<TasksDataDTO> {}
