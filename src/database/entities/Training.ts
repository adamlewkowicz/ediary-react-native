import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { GenericEntity } from '../generics/GenericEntity';
import { TrainingId, UserId, ExerciseId } from '../../types';
import { Exercise } from './Exercise';
import { User } from './User';
import { observable, flow } from 'mobx';

@Entity('trainings')
export class Training extends GenericEntity {

  @PrimaryGeneratedColumn()
  id!: TrainingId;

  @Column()
  name!: string;

  /** Duration of training in seconds */
  @observable
  @Column({ default: 0 })
  duration!: number;

  @Column()
  userId!: UserId;

  @OneToMany(
    type => Exercise,
    exercise => exercise.training
  )
  exercises?: Exercise[];

  @ManyToOne(
    type => User,
    user => user.trainings,
    { onDelete: 'CASCADE' }
  )
  @JoinColumn({ name: 'userId' })
  user?: User;

  removeExercise = flow(function*(this: Training,
    exerciseId: ExerciseId
  ) {
    if (this.exercises) {
      this.exercises.filter(exercise => exercise.id !== exerciseId);
    }
    yield Exercise.delete(exerciseId as number);
  });

}