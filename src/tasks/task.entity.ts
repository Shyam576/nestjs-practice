import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { TaskStatus } from "../constants/task-status.enum";

@Entity()
export class TaskEntity {
   @Column()
   @PrimaryGeneratedColumn('uuid')
   id: string;

   @Column()
   title:string;

   @Column()
   description:string;

   @Column()
   status: TaskStatus;
}