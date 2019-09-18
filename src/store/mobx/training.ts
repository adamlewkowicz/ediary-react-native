import { observable, flow, computed, reaction, IReactionDisposer } from 'mobx';
import { RootStore } from '.';
import { Meal } from '../../database/entities';
import { MealId } from '../../types';

const trainingsMock = [
  {
    id: 1,
    name: 'Chest and legs',
    duration: 0,
    exercises: [
      {
        id: 1,
        name: 'Bench press',
        trainingId: 1,
        sets: [
          {
            id: 1,
            repeats: 3,
            loadWeight: 6,
            exerciseId: 1,
          }
        ]
      }
    ]
  }
]

export class TrainingStore {
  @observable trainings: Training[] = [];
  @observable exercises: Exercise[] = [];
  @observable sets: Sets[] = [];
  @observable meals: Meal[] = [];
  @observable mealsMap: Map<MealId, Meal> = new Map();

  constructor(private readonly rootStore: RootStore) {
  }

  loadTrainings = flow(function*(this: TrainingStore) {

    const { trainings } = trainingsMock
      .reduce((normalized, { exercises, ...training }) => {
        const normalizedTraining: Training = {
          ...training,
          isActive: false,
          exerciseIds: exercises.map(exercise => exercise.id)
        }
        const normalizedExercises: any[] = exercises
          .reduce((normalized, { sets, ...exercise }) => , [[], []]);

        return {
          ...normalized,
          trainings: [...normalized.trainings, normalizedTraining]
        }
      }, { trainings: [], exercises: [], sets: [] });

    this.trainings = trainings;
  });

  updateMeal = flow(function*(this: TrainingStore, mealId: MealId) {
    const meal = this.mealsMap.get(mealId);
    if (meal) {
      yield meal.save();
    }
  });

  @computed
  get activeTraining(): Training | null {
    const foundTraining = this.trainings.find(training => training.isActive);
    if (foundTraining) {
      return foundTraining;
    }
    return null;
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

interface Training {
  id: number
  name: string
  duration: number
  isActive: boolean
  exerciseIds: number[]
}

interface Exercise {
  id: number
  name: string
  setIds: number[]
}

interface Sets {
  id: number
  repeats: number
  loadWeight: number
}