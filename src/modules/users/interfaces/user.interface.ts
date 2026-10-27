export enum UserRole {
    ADMIN = 'ADMIN',
    DEVELOPER = 'DEVELOPER'
}

export interface User {
    id: string,
    name: string,
    email: string,
    role: UserRole,
    isActive: boolean,
    createdAt: Date
}

export interface CreateUserPayload {
    name: string,
    email: string,
    role?: UserRole
}
