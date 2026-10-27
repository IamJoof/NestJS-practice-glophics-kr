import { randomUUID } from "crypto";
import { CreateUserPayload, User, UserRole } from "./interfaces/user.interface.js";




export class UsersRepository {
    private users : User[] = []

    findAll(): User[] {
        return [...this.users];
    }

    findById(id: string): User | null {
        return this.users.find(
            (u) => u.id === id
        ) ?? null;
    }

    findByEmail(email: string) : User | null {
        const normalized = email.trim().toLowerCase();
        return (
            this.users.find(
                (user) => user.email.toLowerCase() === normalized)
                ?? null
        );
    }

    create(payload: CreateUserPayload): User {
        const newUser: User = {
            id: randomUUID(),
            name: payload.name.trim(),
            email: payload.email.trim().toLowerCase(),
            role: payload.role ?? UserRole.DEVELOPER,
            isActive: true,
            createdAt: new Date(),
        };

        this.users.push(newUser);
        return newUser;
    }

}