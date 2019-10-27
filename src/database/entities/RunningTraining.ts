import { GenericEntity } from '../generics/GenericEntity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { RunningTrainingId, UserId } from '../../types';
import { User } from './User';
import { RunningCoord } from './RunningCoords';

@Entity('running_trainings')
export class RunningTraining extends GenericEntity {

  @PrimaryGeneratedColumn()
  id!: RunningTrainingId;

  @Column()
  duration!: number;

  @Column()
  userId!: UserId;

  @OneToMany(
    type => RunningCoord,
    runningCoord => runningCoord,
  )
  coords?: RunningCoord[];

  @ManyToOne(
    type => User,
    user => user.id,
    { onDelete: 'CASCADE' }
  )
  user!: User;

}