import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { UsersRepository } from './user.repository.js';
import { CreateUserPayload, User } from './interfaces/user.interface.js';
import { CreateTaskPayload, Task } from '../tasks/interfaces/tasks.interfaces.js';

@Injectable()
export class UsersService {
    constructor(private readonly userRepository: UsersRepository){}

    getUsers(): User[]
    {
        return this.userRepository.findAll();
    }

    getUserById(id: string): User {
        const user = this.userRepository.findById(id);
        if(!user) {
            throw new NotFoundException(`User with id: ${id} does not exist in the records`);
        }
        return user;
    }

    createUser(payload: CreateUserPayload): User {
        const existing = this.userRepository.findByEmail(payload.email);
        if(existing){
            throw new ConflictException(`Email ${payload.email} is already registered`);
        }
        return this.userRepository.create(payload);
    }
}
