import { ApiProperty } from "@nestjs/swagger";
import { IsEnum } from "class-validator";
import { TaskStatus } from "../../constants/task-status.enum";

export class UpdateTaskStatusDto {
    
    @ApiProperty({
        description : 'Update the status for the task',
    })
    @IsEnum(TaskStatus)
    status: TaskStatus;
}