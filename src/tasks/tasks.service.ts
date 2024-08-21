import { UserEntity } from 'src/auth/user.entity';
import { getTasksFilterDto } from './dto/get-tasks-filter.dto';
import { Injectable, Search } from '@nestjs/common';
import { TaskStatus } from '../constants/task-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskNotFoundException } from './exceptions/task-not-found.exception';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskEntity } from './task.entity';
import { FindManyOptions, Like, Repository } from 'typeorm';
import { UUID } from 'crypto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskEntity)
    private taskRepository: Repository<TaskEntity>,
  ) {}

  async getAllTasks(
    user: UserEntity,
    getTasksFilterDto: getTasksFilterDto,
  ): Promise<TaskEntity[]> {
    const { status, search } = getTasksFilterDto;

    const query = this.taskRepository
      .createQueryBuilder('task')
      .where({ user });

    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (search) {
      query.andWhere(
        '(LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search))',
        { search: `%${search}%` },
      );
    }

    const tasks = await query.getMany();
    return tasks;
  }

  async createTask(
    user: UserEntity,
    createTaskDto: CreateTaskDto,
  ): Promise<TaskEntity> {
    const { title, description } = createTaskDto;
    const task = {
      title,
      description,
      status: TaskStatus.OPEN,
      user,
    };

    const taskEntity = this.taskRepository.create(task);
    await this.taskRepository.save(taskEntity);
    return taskEntity;
  }

  async getTaskById(id: string, user: UserEntity): Promise<TaskEntity> {
    const taskEntity = await this.taskRepository.findOne({
      where: { id: id, user: user },
    });

    if (!taskEntity) {
      throw new TaskNotFoundException(`There is no task with id ${id}`);
    }

    return taskEntity;
  }

  async updateTaskById(
    id: string,
    updateTaskDto: UpdateTaskDto,
  ): Promise<TaskEntity> {
    const taskEntity = await this.taskRepository.findOne({ where: { id: id } });
    if (!taskEntity) {
      throw new TaskNotFoundException(`Task not found for ID: ${id}`);
    }

    const updatedTask = this.taskRepository.merge(taskEntity, updateTaskDto);
    await this.taskRepository.save(updatedTask);
    return updatedTask;
  }

  async updateTaskStatus(
    id: string,
    status: TaskStatus,
    user: UserEntity,
  ): Promise<TaskEntity> {
    const task = await this.taskRepository.findOne({
      where: {
        id: id,
        user: user,
      },
    });

    if (!task) {
      throw new TaskNotFoundException(`Task with ${id} not found`);
    }
    await this.taskRepository.update(id, {
      status: status,
    });
    return task;
  }

  async deleteTask(id: string, user: UserEntity) {
    const result = await this.taskRepository.delete({id, user});

    if (result.affected === 0) {
      throw new TaskNotFoundException(`Task not found for ID: ${id}`);
    }
  }

  async getTasks(getTasksFilterDto: getTasksFilterDto): Promise<TaskEntity[]> {
    const queryBuilder = this.taskRepository
      .createQueryBuilder('task_entity')
      .where('task_entity.status = :status', {
        status: getTasksFilterDto.status,
      })
      .orWhere(
        'LOWER(task_entity.title) LIKE :search OR LOWER(task_entity.description) LIKE LOWER(:search)',
        { search: `%${getTasksFilterDto.search}%` },
      );

    const tasks = await queryBuilder.getMany();

    return tasks;
  }
}
