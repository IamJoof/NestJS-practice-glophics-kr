// src/modules/tasks/tasks.controller.ts
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import type {
  CreateTaskPayload,
  Task,
  TaskStatus,
  UpdateTaskStatusPayload,
} from './interfaces/tasks.interfaces.js';
import { TasksService } from './tasks.service.js';

@Controller('tasks')
export class TasksController {
  // Dependency Injection: Controller only knows about TasksService
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  findAll(
    @Query('status') status?: TaskStatus,
    @Query('search') search?: string,
  ): Task[] {
    return this.tasksService.getTasks(status, search);
  }

  @Get('stats')
  getTaskStats(): Record<TaskStatus, number> {
    return this.tasksService.getTaskStats();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Task {
    return this.tasksService.getTaskById(id);
  }

  @Post()
  create(@Body() payload: CreateTaskPayload): Task {
    return this.tasksService.createTask(payload);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() payload: UpdateTaskStatusPayload,
  ): Task {
    return this.tasksService.updateTaskStatus(id, payload);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string): void {
    this.tasksService.deleteTask(id);
  }
}