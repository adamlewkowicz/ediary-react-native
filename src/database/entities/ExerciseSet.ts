import {
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Entity,
  AfterUpdate,
} from 'typeorm';
import { GenericEntity } from '../generics/GenericEntity';
import { ExerciseId, ExerciseSetId } from '../../types';
import { Exercise } from './Exercise';

@Entity('exercise_sets')
export class ExerciseSet extends GenericEntity {

  @PrimaryGeneratedColumn()
  id!: ExerciseSetId;

  @Column()
  repeats!: number;

  @Column()
  loadWeight!: number;

  @Column()
  exerciseId!: ExerciseId;

  @ManyToOne(
    type => Exercise,
    exercise => exercise.sets,
    { onDelete: 'CASCADE' }
  )
  @JoinColumn({ name: 'exerciseId' })
  exercise?: Exercise;

}