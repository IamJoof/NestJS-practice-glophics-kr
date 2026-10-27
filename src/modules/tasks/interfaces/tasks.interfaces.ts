export enum TaskStatus {
    OPEN = 'open',
    IN_PROGRESS = 'in_progress',
    DONE = 'done'
}

export interface Task {
    id: string;
    title: string;
    description: string;
    status: TaskStatus;
    userId: string;
    createdAt: Date;
}

export interface CreateTaskPayload {
    title: string;
    description: string;
    userId: string;
}

export interface UpdateTaskStatusPayload {
    status: TaskStatus;
}