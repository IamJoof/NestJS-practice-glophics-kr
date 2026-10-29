// src/modules/tasks/tasks.repository.ts
import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import {
  CreateTaskPayload,
  Task,
  TaskStatus,
} from './interfaces/tasks.interfaces.js';

@Injectable()
export class TasksRepository {
  private tasks: Task[] = [];

  findAll(status?: TaskStatus, search?: string): Task[] {
    let results = [...this.tasks];

    if (status) {
      results = results.filter((task) => task.status === status);
    }

    if (search) {
      const keyword = search.toLowerCase();
      results = results.filter(
        (task) =>
          task.title.toLowerCase().includes(keyword) ||
          task.description.toLowerCase().includes(keyword),
      );
    }

    return results;
  }

  findById(id: string): Task | null {
    const task = this.tasks.find((t) => t.id === id);
    return task ?? null;
  }

  findByTitle(title: string): Task | null {
    const normalized = title.toLowerCase();
    const task = this.tasks.find((task) => task.title.toLowerCase() === normalized);
    return task ?? null;
  }

  countByStatus(): Record<TaskStatus, number> {
    return {
      [TaskStatus.OPEN]: this.tasks.filter(
        (t) => t.status === TaskStatus.OPEN,
      ).length,
      [TaskStatus.IN_PROGRESS]: this.tasks.filter(
        (t) => t.status === TaskStatus.IN_PROGRESS,
      ).length,
      [TaskStatus.DONE]: this.tasks.filter(
        (t) => t.status === TaskStatus.DONE,
      ).length,
    };
  }

  create(payload: CreateTaskPayload): Task {
    const newTask: Task = {
      id: randomUUID(),
      title: payload.title,
      description: payload.description,
      status: TaskStatus.OPEN,
      userId: payload.userId,
      createdAt: new Date(),
    };

    this.tasks.push(newTask);
    return newTask;
  }

  updateStatus(id: string, status: TaskStatus): Task | null {
    const task = this.findById(id);
    if (!task) {
      return null;
    }

    task.status = status;
    return task;
  }

  deleteById(id: string): boolean {
    const index = this.tasks.findIndex((t) => t.id === id);
    if (index === -1) {
      return false;
    }

    this.tasks.splice(index, 1);
    return true;
  }
}