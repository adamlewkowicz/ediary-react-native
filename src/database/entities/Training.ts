import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { GenericEntity } from '../generics/GenericEntity';
import { TrainingId, UserId } from '../../types';
import { Exercise } from './Exercise';
import { User } from './User';

@Entity('trainings')
export class Training extends GenericEntity {

  @PrimaryGeneratedColumn()
  id!: TrainingId;

  @Column()
  name!: string;

  /** Duration of training in seconds */
  @Column({ default: 0 })
  duration!: number;

  @Column()
  userId!: UserId;

  @OneToMany(
    type => Exercise,
    exercise => exercise.trainings
  )
  exercises?: Exercise[];

  @ManyToOne(
    type => User,
    user => user.trainings,
    { onDelete: 'CASCADE' }
  )
  @JoinColumn({ name: 'userId' })
  user?: User;

}