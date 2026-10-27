import { IsEnum, IsNotEmpty } from 'class-validator';
import { TaskStatus } from '../interfaces/tasks.interfaces.js';

export class GetTasksFilterDto {
  @IsEnum(TaskStatus, {
    message: `status must be one of: ${Object.values(TaskStatus).join(', ')}`,
  })
  status?: TaskStatus;

  @IsNotEmpty()
  search?: string;
}