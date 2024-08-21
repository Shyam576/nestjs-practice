import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { getTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskEntity } from './task.entity';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { UserEntity } from 'src/auth/user.entity';
import { Logger } from '@nestjs/common';

@ApiTags('tasks')
@Controller('tasks')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
export class TasksController {
  private logger = new Logger('TasksController');
  constructor(private tasksService: TasksService) {}

  @Post()
  @ApiOperation({ summary: 'Create a Task' })
  @ApiResponse({ status: 201, description: 'Successfully created a task' })
  createTask(
    @GetUser() user: UserEntity,
    @Body() createTaskDto: CreateTaskDto,
  ): Promise<TaskEntity> {
    return this.tasksService.createTask(user, createTaskDto);
  }
  @Get()
  @ApiOperation({ summary: 'Get tasks' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved tasks' })
  getAllTask(
    @GetUser() user: UserEntity,
    @Query() getTasksFilterDto: getTasksFilterDto,
  ): Promise<TaskEntity[]> {
    this.logger.verbose(
      `User "${user.username}" retreiving all tasks. Filters: ${JSON.stringify(getTasksFilterDto)}`,
    );
    return this.tasksService.getAllTasks(user, getTasksFilterDto);
  }

  @Get('get-task')
  getTasks(
    @Query() getTasksFilterDto: getTasksFilterDto,
  ): Promise<TaskEntity[]> {
    return this.tasksService.getTasks(getTasksFilterDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get task by ID' })
  @ApiResponse({ status: 200, description: 'Task retrieved successfully' })
  getTaskByi(
    @Param('id') id: string,
    @GetUser() user: UserEntity,
  ): Promise<TaskEntity> {
    return this.tasksService.getTaskById(id, user);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a task by id' })
  @ApiResponse({ status: 200, description: 'Task updated successfully' })
  updateTaskById(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ): Promise<TaskEntity> {
    return this.tasksService.updateTaskById(id, updateTaskDto);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: ' Update status of the task' })
  @ApiResponse({ status: 200, description: ' Task satus updated successfully' })
  updateTaskStatus(
    @Param('id') id: string,
    @Body() updateTaskStatusDto: UpdateTaskStatusDto,
    @GetUser() user: UserEntity,
  ): Promise<TaskEntity> {
    const { status } = updateTaskStatusDto;
    return this.tasksService.updateTaskStatus(id, status, user);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a task' })
  @ApiResponse({ status: 200, description: 'Task deleted successfully' })
  deleteTask(@Param('id') id: string, @GetUser() user: UserEntity) {
    return this.tasksService.deleteTask(id, user);
  }
}
