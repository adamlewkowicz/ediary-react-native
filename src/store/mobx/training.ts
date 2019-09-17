import { observable, flow } from 'mobx';
import { RootStore } from '.';

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

  constructor(private readonly rootStore: RootStore) {}

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
  },);

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