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
import { EntityType, EntityStore } from '../types';
import { runInAction, action, flow, reaction, observable, computed, IReactionDisposer } from 'mobx';
import { EntityStoreWatcher } from '../../store/mobx/EntityStore.decorator';

// @EntityStoreWatcher<Exercise>(['name'])
@Entity('exercises')
export class Exercise extends GenericEntity implements EntityStore<Exercise> {
  disposeSaveHandler: IReactionDisposer;

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
    this.disposeSaveHandler = reaction(
      () => this.entityWatcher,
      (updt) => {
        console.log('UPDT', updt)
      }
    );
  }

  @computed get entityWatcher() {
    return { ...this }
  }

  dispose() {
    this.disposeSaveHandler();
    if (this.sets) {
      this.sets.forEach(set => {
        if (set.dispose) {
          set.dispose();
        }
      });
    }
  }

  drop(): Promise<Exercise> {
    this.dispose();
    return this.remove();
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