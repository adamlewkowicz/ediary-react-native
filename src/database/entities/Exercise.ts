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
import { runInAction, action, flow, reaction, observable, computed } from 'mobx';

@Entity('exercises')
export class Exercise extends GenericEntity {

  @PrimaryGeneratedColumn()
  id!: ExerciseId;

  @observable
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
  training?: Training;

  @OneToMany(
    type => ExerciseSet,
    exerciseSet => exerciseSet.exercise
  )
  sets?: ExerciseSet[];

  // @ts-ignore
  _addExerciseSet = flow(function*(this: Exercise, 
    payload: { loadWeight: number, repeats: number }
  ) {
    const exerciseId = this.id;
    const exerciseSet: ExerciseSet = yield ExerciseSet.save({
      ...payload,
      exerciseId
    });
    this.sets = this.sets ? [...this.sets, exerciseSet] : [exerciseSet];
  });

  constructor() {
    super();
    reaction(
      () => this.watcher,
      (updt) => {
        console.log('UPDT', updt)
      }
    )
  }

  @computed get watcher() {
    return { ...this }
  }

  @action async addExerciseSet(payload: { loadWeight: number, repeats: number }) {
    const exerciseId = this.id;
    const exerciseSet = await ExerciseSet.save({
      ...payload,
      exerciseId
    });
    runInAction(() => {
      if (this.sets) {
        this.sets.push(exerciseSet)
      }
    });
  }

}

export type IExercise = EntityType<Exercise>;