import { TrainingState, ExerciseState, ExerciseSetState } from './training';

export interface NormalizedExercises {
  exercises: ExerciseState[]
  exerciseSets: ExerciseSetState[]
}

export interface NormalizedTrainings extends NormalizedExercises {
  trainings: TrainingState[]
}