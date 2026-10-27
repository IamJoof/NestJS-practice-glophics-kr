import {
    IsEmail,
    IsEnum,
    IsNotEmpty,
    IsOptional,
    IsString,
    MaxLength,
    MinLength,
} from 'class-validator';
import { UserRole } from '../interfaces/user.interface.js';

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(2)
    @MaxLength(60)
    name!: string;

    @IsEmail(
        {}, {
            message: 'Email must be a valid email address'
        }
    )
    @IsNotEmpty()
    email!: string;

    @IsOptional()
    @IsEnum(UserRole, { message:`USer role must be one of the following: ${Object.values(UserRole).join(', ')}` })
    role?: UserRole;

}