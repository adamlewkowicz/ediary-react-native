import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { GenericEntity } from '../generics/GenericEntity';
import { ExerciseId, TrainingId } from '../../types';
import { Training } from './Training';
import { ExerciseSet } from './ExerciseSet';
import { EntityType } from '../types';

@Entity('exercises')
export class Exercise extends GenericEntity {

  @PrimaryGeneratedColumn()
  id!: ExerciseId;

  @Column()
  name!: string;

  @Column()
  trainingId!: TrainingId;

  @ManyToOne(
    type => Training,
    training => training.exercises,
    { onDelete: 'CASCADE' }
  )
  @JoinColumn({ name: 'trainingId' })
  trainings?: Training[];

  @OneToMany(
    type => ExerciseSet,
    exerciseSet => exerciseSet.exercise
  )
  sets?: ExerciseSet[];

}

export type IExercise = EntityType<Exercise>;