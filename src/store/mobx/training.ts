import { observable, flow, computed, reaction, IReactionDisposer } from 'mobx';
import { RootStore } from '.';
import { Meal, Training, Exercise } from '../../database/entities';
import { MealId, ExerciseId, TrainingId, ExerciseSetId } from '../../types';
import { normalizeTrainings } from './utils';

export class TrainingStore {
  @observable trainings: TrainingState[] = [];
  @observable exercises: ExerciseState[] = [];
  @observable exerciseSets: ExerciseSetState[] = [];
  @observable mealsMap: Map<MealId, Meal> = new Map();

  constructor(private readonly rootStore: RootStore) {}

  loadTrainings = flow(function*(this: TrainingStore) {
    const foundTrainings: Training[] = yield Exercise.find();
    const { trainings, exercises, exerciseSets } = normalizeTrainings(foundTrainings);

    this.trainings = trainings;
    this.exercises = exercises;
    this.exerciseSets = exerciseSets;
  });

  @computed
  get mergedTrainings() {
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