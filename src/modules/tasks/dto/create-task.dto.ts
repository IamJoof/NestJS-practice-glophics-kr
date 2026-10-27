import { IsNotEmpty, IsString, IsUUID, MaxLength, MinLength } from "class-validator";

export class CreateTaskDto {

    @IsString()
    @IsNotEmpty()
    @MinLength(3, { message: 'Task title must be at least 3 characters long' })
    @MaxLength(100, { message: 'Task title caps at 100 characters long' })
    title!: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(500)
    description!: string;

    @IsUUID('4', { message: 'User ID must be a valid UUID v4' })
    @IsNotEmpty()
    userId!: string;
}