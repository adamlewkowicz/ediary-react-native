import { observable, flow, computed, reaction, IReactionDisposer } from 'mobx';
import { RootStore } from '.';
import { Meal, Training, ExerciseSet } from '../../database/entities';
import { MealId, ExerciseId, TrainingId, ExerciseSetId } from '../../types';
import { normalizeTrainings } from './utils';
import { findById } from '../../common/utils';

export class TrainingStore {
  @observable trainings: TrainingState[] = [];
  @observable exercises: ExerciseState[] = [];
  @observable exerciseSets: ExerciseSetState[] = [];
  @observable mealsMap: Map<MealId, Meal> = new Map();
  @observable isLoading: boolean = false;
  @observable entity: Training | null = null;

  constructor(private readonly rootStore: RootStore) {
    reaction(
      () => this.entityJSON,
      () => {
        if (this.entity) {
          this.entity.save();
        }
      }
    )
  }

  @computed
  get entityJSON() {
    return { ...this.entity }
  }

  // @ts-ignore
  loadTrainings = flow(function*(this: TrainingStore) {
    this.isLoading = true;
    const foundTrainings: Training[] = yield Training.find({
      relations: ['exercises', 'exercises.sets']
    }) as any;
    const { trainings, exercises, exerciseSets } = normalizeTrainings(foundTrainings);
    this.entity = foundTrainings[0];

    this.trainings = trainings;
    this.exercises = exercises;
    this.exerciseSets = exerciseSets;
    this.isLoading = false;
  });

  exerciseSetUpdate = flow(function*(this: TrainingStore,
    exerciseSetId: ExerciseSetId,
    payload: Partial<ExerciseSetState>
  ) {
    const exerciseSet = findById(this.exerciseSets, exerciseSetId);
    if (exerciseSet) {
      Object.assign(exerciseSet, payload);
      yield ExerciseSet.update(exerciseSetId as number, payload);
    }
  });

  @computed
  get mergedTrainings() {
    console.log('mergedTrainings RECOMPUTED')
    return this.trainings.map(training => ({
      ...training,
      exercises: training.exerciseIds.flatMap(exerciseId => {
        const exercise = this.exercises.find(
          exercise => exercise.id === exerciseId
        );
        if (exercise) {
          return {
            ...exercise,
            sets: exercise.setIds.flatMap(exerciseSetId => {
              const exerciseSet = this.exerciseSets.find(
                exerciseSet => exerciseSet.id === exerciseSetId
              );
              return exerciseSet ? exerciseSet : [];
            })
          }
        }
        return [];
      })
    }))
  }

  @computed
  get activeTraining(): TrainingState | null {
    return this.trainings.find(training => training.isActive) || null;
  }
}

class MealStore {
  @observable isToggled: boolean = false;
  @observable entity: Meal | null = null;

  saveHandler: IReactionDisposer | null = null;

  constructor(
    private readonly rootStore: RootStore,
    mealEntity: Meal
  ) {
    this.entity = mealEntity;

    this.saveHandler = reaction(
      () => this.entity,
      async () => {
        if (this.entity) {
          await this.entity.save();
        }
      }
    );
  }

  updateMeal = flow(function*(this: MealStore, payload: Partial<Meal>) {
    Object.assign(this.entity, payload);
  });

}

export interface TrainingState {
  id: TrainingId
  duration: number
  isActive: boolean
  exerciseIds: ExerciseId[]
}

export interface ExerciseState {
  id: ExerciseId
  name: string
  setIds: ExerciseSetId[]
  trainingId: TrainingId
}

export interface ExerciseSetState {
  id: ExerciseSetId
  repeats: number
  loadWeight: number
  exerciseId: ExerciseId
}