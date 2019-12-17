import { GenericEntity } from '../generics/GenericEntity';
import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Exercise } from './Exercise';
import { ExerciseId, ExerciseSetId } from '../../types';

@Entity('exercise_sets')
export class ExerciseSet extends GenericEntity {

  @PrimaryGeneratedColumn()
  id!: ExerciseSetId;

  @Column()
  repeats!: number;

  @Column()
  loadWeight!: number;

  @Column()
  breakTime!: number;

  @Column()
  exerciseId!: ExerciseId;

  @OneToMany(
    type => Exercise,
    exercise => exercise.sets,
  )
  @JoinColumn({ name: 'exerciseId' })
  exercise?: Exercise;

}