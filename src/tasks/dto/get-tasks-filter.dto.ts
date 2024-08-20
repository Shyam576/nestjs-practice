import { IsEnum, IsOptional, IsString } from "class-validator";
import { TaskStatus } from "../../constants/task-status.enum";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class getTasksFilterDto {
    @ApiPropertyOptional({ enum: TaskStatus })
    @IsOptional()
    @IsEnum(TaskStatus)
    status?: TaskStatus;

    @ApiPropertyOptional({ type: String })
    @IsOptional()
    @IsString()
    search?: string;
}
