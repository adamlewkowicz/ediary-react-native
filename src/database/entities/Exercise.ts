import { GenericEntity } from '../generics/GenericEntity';
import { 
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { ExerciseId, TrainingId } from '../../types';
import { Training } from './Training';
import { ExerciseSet } from './ExerciseSet';

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
    training => training.exercises
  )
  @JoinColumn({ name: 'trainingId' })
  training?: Training;

  @OneToMany(
    type => ExerciseSet,
    exerciseSet => exerciseSet.exercise,
    { onDelete: 'CASCADE', cascade: ['insert'] }
  )
  sets?: ExerciseSet[];

}