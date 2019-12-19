import { GenericEntity } from '../generics/GenericEntity';
import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { Exercise } from './Exercise';
import { ExerciseId, ExerciseSetId } from '../../types';
import { EntityType, EntityRequired } from '../types';

@Entity('exercise_sets')
export class ExerciseSet extends GenericEntity {

  @PrimaryGeneratedColumn()
  id!: ExerciseSetId;

  @Column({ default: 8 })
  repeats!: number;

  @Column()
  loadWeight!: number;

  @Column()
  breakTime!: number;

  @Column()
  exerciseId!: number;

  @ManyToOne(
    type => Exercise,
    exercise => exercise.sets,
    { onDelete: 'CASCADE' }
  )
  @JoinColumn({ name: 'exerciseId' })
  exercise?: Exercise;

}

export type IExerciseSet = EntityType<ExerciseSet>;
export type IExerciseSetRequired = EntityRequired<IExerciseSet,
  | 'loadWeight'
  | 'breakTime'
  | 'exerciseId'
>;