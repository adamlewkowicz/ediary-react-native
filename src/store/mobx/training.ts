import {
  observable,
  flow,
  computed,
  reaction,
  action,
} from 'mobx';
import { RootStore } from '.';
import { Training, ExerciseSet } from '../../database/entities';
import { ExerciseId, TrainingId, ExerciseSetId } from '../../types';
import { normalizeTrainings } from './utils';
import { findById } from '../../common/utils';

export class TrainingStore {
  @observable trainings: TrainingState[] = [];
  @observable exercises: ExerciseState[] = [];
  @observable exerciseSets: ExerciseSetState[] = [];
  @observable isLoading = false;
  @observable entity: Training | null = null;
  
  durationInterval!: NodeJS.Timeout;

  constructor(private readonly rootStore: RootStore) {
    reaction(
      () => this.entityJSON,
      () => {
        if (this.entity) {
          this.entity.save();
        }
      }
    );
    reaction(
      () => this.activeTraining && this.activeTraining.isPaused,
      () => {
        if (this.activeTraining) {
          if (this.activeTraining.isPaused) {
            clearInterval(this.durationInterval);
          } else {
            this.durationInterval = setInterval(this.trainingDurationIncrement, 1000);
          }
        }
      }
    );
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

  @action trainingStart(trainingId: TrainingId) {
    this.trainings.forEach(training => {
      if (training.id === trainingId) {
        if (this.activeTraining === null) {
          training.isActive = true;
        } else if (training.isActive) {
          training.isPaused = !training.isPaused;
        }
      }
    });
  }

  @action.bound private trainingDurationIncrement() {
    if (this.activeTraining) this.activeTraining.duration++;
    if (this.activeExercise) this.activeExercise.duration++;
    if (this.activeExerciseSet) {
      this.activeExerciseSet.duration++;

      if (this.activeExerciseSet.isRest) {
        const restHasFinished = this.activeExerciseSet.restDuration >= this.activeExerciseSet.restTime;
        this.activeExerciseSet.restDuration++;

        if (restHasFinished) {
          this.activeExerciseSet.isRest = false;
          this.activeExerciseSet.state = 'finished';

          if (this.nextExerciseSet) {
            this.nextExerciseSet.state = 'active';
          }
        }
      }
    }
  }

  @action exerciseSetToggle(exerciseSetId: ExerciseSetId) {
    this.exerciseSets.forEach(exerciseSet => {
      if (exerciseSet.id === exerciseSetId) {
        exerciseSet.state = 'active';
      }
    });
  }

  @computed get mergedTrainings() {
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

  @computed get activeTraining(): TrainingState | null {
    return this.trainings.find(training => training.isActive) || null;
  }

  @computed get activeExerciseSet(): ExerciseSetState | null {
    if (this.activeTraining !== null) {
      const exerciseSet = this.exerciseSets.find(exerciseSet => 
        exerciseSet.state === 'active'
      );
      if (exerciseSet) return exerciseSet;
    }
    return null;
  }
  
  @computed get activeExercise(): ExerciseState | null {
    if (this.activeExerciseSet !== null) {
      const exercise = this.exercises.find(exercise => 
        exercise.id === this.activeExerciseSet!.exerciseId
      );
      if (exercise) return exercise;
    }
    return null;
  }

  @computed get nextExerciseSet(): ExerciseSetState | null {
    return this.exerciseSets.find(exerciseSet => 
      exerciseSet.state === 'unfinished'
    ) || null;
  }

}

export interface TrainingState {
  id: TrainingId
  name: string
  duration: number
  isActive: boolean
  isPaused: boolean
  exerciseIds: ExerciseId[]
}

export interface ExerciseState {
  id: ExerciseId
  name: string
  setIds: ExerciseSetId[]
  trainingId: TrainingId
  duration: number
}

export interface ExerciseSetState {
  id: ExerciseSetId
  repeats: number
  loadWeight: number
  exerciseId: ExerciseId
  duration: number
  restTime: number
  restDuration: number
  isRest: boolean
  state: 'unfinished' | 'active' | 'finished'
  // state: 'unfinished' | 'training' | 'rest' | 'finished'
}