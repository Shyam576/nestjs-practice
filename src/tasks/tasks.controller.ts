import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TaskStatus } from '../constants/task-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { getTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskEntity } from './task.entity';
import { UUID } from 'crypto';

@ApiTags('tasks')
@Controller('tasks')
export class TasksController {
    constructor(
        private tasksService: TasksService
    ){}

    @Post()
    @ApiOperation({summary: 'Create a Task'})
    @ApiResponse({ status:201, description: 'Successfully created a task'})
    createTask(
        @Body() createTaskDto: CreateTaskDto
    ):Promise<TaskEntity>{
        return this.tasksService.createTask(createTaskDto)
    }
    @Get()
    @ApiOperation({ summary: 'Get tasks' })
    @ApiResponse({ status: 200, description: 'Successfully retrieved tasks' })
    getAllTask(@Query() getTasksFilterDto: getTasksFilterDto):  Promise<TaskEntity[]> {
        return this.tasksService.getAllTasks(getTasksFilterDto);
    }
    
    @Get('get-task')
    getTasks(@Query() getTasksFilterDto: getTasksFilterDto): Promise<TaskEntity[]>{
        return this.tasksService.getTasks(getTasksFilterDto)
    }

    @Get(':id')
    @ApiOperation({summary: 'Get task by ID'})
    @ApiResponse({status:200, description: 'Task retrieved successfully'})
    getTaskByid(
        @Param('id') id: string
    ):Promise<TaskEntity>{
        return this.tasksService.getTaskById(id);
    }
    
    @Patch(':id')
    @ApiOperation({summary: 'Update a task by id'})
    @ApiResponse({status: 200, description: 'Task updated successfully'})
    updateTaskById(
        @Param('id') id: string,
        @Body() updateTaskDto: UpdateTaskDto,
    ):Promise<TaskEntity>{
        return this.tasksService.updateTaskById(id, updateTaskDto)
    }

    @Patch(':id/status')
    @ApiOperation({summary: ' Update status of the task'})
    @ApiResponse({ status: 200, description: ' Task satus updated successfully'})
    updateTaskStatus(
        @Param('id') id: string,
        @Body() updateTaskStatusDto: UpdateTaskStatusDto
    ): Promise<TaskEntity>{
        const {status} = updateTaskStatusDto;
        return this.tasksService.updateTaskStatus(id, status)
    }

    @Delete(':id')
    @ApiOperation({summary: 'Delete a task'})
    @ApiResponse({status: 200, description: 'Task deleted successfully'})
    deleteTask(
        @Param('id') id:string,
    ){
        return this.tasksService.deleteTask(id);
    }

}
