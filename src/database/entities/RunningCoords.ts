import { GenericEntity } from '../generics/GenericEntity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
} from 'typeorm';
import { RunningCoordId, RunningTrainingId } from '../../types';
import { RunningTraining } from './RunningTraining';

@Entity('running_coords')
export class RunningCoord extends GenericEntity {

  @PrimaryGeneratedColumn()
  id!: RunningCoordId;

  @Column()
  latitude!: number;

  @Column()
  longitude!: number;

  @Column()
  trainingId!: RunningTrainingId;

  @ManyToOne(
    type => RunningTraining,
    training => training.coords,
    { onDelete: 'CASCADE' }
  )
  training?: RunningTraining;

}