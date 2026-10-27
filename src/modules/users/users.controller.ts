import { Body, Controller, Get , Param, Post} from '@nestjs/common';
import { UsersService } from './users.service.js';
import type { CreateUserPayload, User } from './interfaces/user.interface.js';

@Controller('users')
export class UsersController {

    constructor(private readonly userService: UsersService){}

    @Get()
    findAll(): User[] {
        return this.userService.getUsers()
    }

    @Get(':id')
    findOne(
        @Param('id') id: string
    ) : User {
        return this.userService.getUserById(id);
    }

    @Post()
    create(
        @Body() payload : CreateUserPayload
    ) : User {
        return this.userService.createUser(payload);
    }
}
