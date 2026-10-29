// src/modules/tasks/tasks.controller.ts
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto.js';
import { TasksService } from './tasks.service.js';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto.js';
import type { Task, TaskStatus } from './interfaces/tasks.interfaces.js';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto.js';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  findAll(@Query() filterDto: GetTasksFilterDto): Task[] {
    return this.tasksService.getTasks(filterDto.status, filterDto.search);
  }

  @Get('stats')
  getTaskStats(): Record<TaskStatus, number> {
    return this.tasksService.getTaskStats();
  }

  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe({version: 4})) id: string): Task {
    return this.tasksService.getTaskById(id);
  }

  @Post()
  create(@Body() createTaskDto: CreateTaskDto): Task {
    return this.tasksService.createTask(createTaskDto);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id', new ParseUUIDPipe({version: 4})) id: string,
    @Body() updateTaskStatusDto: UpdateTaskStatusDto,
  ): Task {
    return this.tasksService.updateTaskStatus(id, updateTaskStatusDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', new ParseUUIDPipe({version: 4})) id: string): void {
    this.tasksService.deleteTask(id);
  }
}