import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TaskStatus } from '../constants/task-status.enum';
import { UserEntity } from 'src/auth/user.entity';
import { Exclude } from 'class-transformer';



@Entity()
export class TaskEntity {
  @Column()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  status: TaskStatus;

  @ManyToOne((_type) => UserEntity, (user) => user.tasks, { eager: false })
  @Exclude({ toPlainOnly: true})
  user: UserEntity;
}
