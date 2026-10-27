// src/modules/tasks/tasks.service.ts
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateTaskPayload,
  Task,
  TaskStatus,
  UpdateTaskStatusPayload,
} from './interfaces/tasks.interfaces.js';
import { TasksRepository } from './tasks.repository.js';
import { UsersService } from '../users/users.service.js';

@Injectable()
export class TasksService {

  constructor(
    private readonly tasksRepository: TasksRepository,
    private readonly usersService: UsersService
  ) {}

  getTasks(status?: TaskStatus, search?: string): Task[] {
    return this.tasksRepository.findAll(status, search);
  }

  getTaskStats(): Record<TaskStatus, number> {
    return this.tasksRepository.countByStatus();
  }

  getTaskById(id: string): Task {
    const task = this.tasksRepository.findById(id);

    if (!task) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }

    return task;
  }

  createTask(payload: CreateTaskPayload): Task {
    const assignedUser = this.usersService.getUserById(payload.userId);
    if(!assignedUser.isActive) {
      throw new BadRequestException(`Cannot assign task to user "${assignedUser.email}"`,);
    }
    const existingTask = this.tasksRepository.findByTitle(payload.title);
    if (existingTask) {
      throw new ConflictException(
        `A task with the title "${payload.title}" already exists`,
      );
    }

    return this.tasksRepository.create(payload);
  }

  updateTaskStatus(id: string, payload: UpdateTaskStatusPayload): Task {
    const currentTask = this.getTaskById(id);

    // Business Rule 2: Once a task is DONE, it cannot be reverted to OPEN
    if (
      currentTask.status === TaskStatus.DONE &&
      payload.status === TaskStatus.OPEN
    ) {
      throw new BadRequestException(
        'A completed (DONE) task cannot be reverted directly to OPEN',
      );
    }

    const updated = this.tasksRepository.updateStatus(id, payload.status);
    return updated!;
  }

  deleteTask(id: string): void {
    const wasDeleted = this.tasksRepository.deleteById(id);

    if (!wasDeleted) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
  }
}