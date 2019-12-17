import { GenericEntity } from '../generics/GenericEntity';
import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  OneToMany,
  JoinColumn,
  ManyToOne,
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
  exerciseId!: number;

  @ManyToOne(
    type => Exercise,
    exercise => exercise.sets,
    { onDelete: 'CASCADE' }
  )
  @JoinColumn({ name: 'exerciseId' })
  exercise?: Exercise;

}