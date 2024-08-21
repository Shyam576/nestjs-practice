import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreateTaskDto{
    @ApiProperty({
        description: 'Title for the task',
        example: 'Clean the room'
    })
    @IsNotEmpty()
    title: string;

    @ApiProperty({
        description: 'Description for the task',
        example: 'Clean the room before leaving for office'
    })
    @IsNotEmpty()
    description: string;
    
}


