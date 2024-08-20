import { ApiProperty } from "@nestjs/swagger";
import { TaskStatus } from "../../constants/task-status.enum";
import { IsEnum } from "class-validator";

export class UpdateTaskDto{
    @ApiProperty({
        description: 'Title for the task',
        example: 'Clean the room'
    })
    title: string;

    @ApiProperty({
        description: 'Description for the task',
        example: 'Clean the room before leaving for office'
    })
    description: string;

}