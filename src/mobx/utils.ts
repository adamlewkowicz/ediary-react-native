import { Training, ExerciseSet, Exercise } from '../database/entities';
import { ExerciseSetState, ExerciseState, TrainingState } from './GymTrainingStore';

export const normalizeExerciseSet = (exerciseSet: ExerciseSet): ExerciseSetState => ({
  ...exerciseSet,
  duration: 0,
  isRest: false,
  restTime: 20,
  restDuration: 0,
  state: 'unfinished',
});

export const normalizeExercise = (exercise: Exercise) => {
  const { sets = [], ..._exercise } = exercise;

  const normalizedExerciseSets = sets.map(normalizeExerciseSet);

  const normalizedExercise: ExerciseState = {
    ..._exercise,
    duration: 0,
    setIds: normalizedExerciseSets.map(set => set.id),
  }

  return {
    exercise: normalizedExercise,
    exerciseSets: normalizedExerciseSets,
  }
}

const normalizeExercises = (exercises: Exercise[]) => {
  return exercises.reduce<NormalizedExercises>((normalized, _exercise) => {
    const { exercise, exerciseSets } = normalizeExercise(_exercise);

    return {
      exercises: [...normalized.exercises, exercise],
      exerciseSets: [...normalized.exerciseSets, ...exerciseSets]
    };
  }, { exercises: [], exerciseSets: [] });
}

export function normalizeTrainings(payload: Training[]) {
  return payload.reduce<NormalizedTrainings>((normalized, training) => {
    const { exercises = [], ...restTraining } = training;

    const result = normalizeExercises(exercises);

    const normalizedTraining: TrainingState = {
      ...restTraining,
      exerciseIds: exercises.map(exercise => exercise.id),
      isPaused: false,
      isActive: false,
    }

    return {
      trainings: [...normalized.trainings, normalizedTraining],
      exercises: [...normalized.exercises, ...result.exercises],
      exerciseSets: [...normalized.exerciseSets, ...result.exerciseSets],
    };
  }, { trainings: [], exercises: [], exerciseSets: [] });
}

interface NormalizedExercises {
  exercises: ExerciseState[]
  exerciseSets: ExerciseSetState[]
}

interface NormalizedTrainings extends NormalizedExercises  {
  trainings: TrainingState[]
}