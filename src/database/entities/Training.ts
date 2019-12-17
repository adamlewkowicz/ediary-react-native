import { GenericEntity } from '../generics/GenericEntity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { TrainingId, UserId } from '../../types';
import { User } from './User';
import { Exercise } from './Exercise';

@Entity('trainings')
export class Training extends GenericEntity {

  @PrimaryGeneratedColumn()
  id!: TrainingId;

  @Column()
  name!: string;

  @Column({ default: 0 })
  duration!: number;

  @Column()
  userId!: UserId;

  @OneToMany(
    type => User,
    user => user.trainings,
    { onDelete: 'CASCADE' }
  )
  @JoinColumn({ name: 'userId' })
  user?: User;

  @OneToMany(
    type => Exercise,
    exercise => exercise.training
  )
  exercises?: Exercise[];

}