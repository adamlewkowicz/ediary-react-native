import { NormalizedTrainings, NormalizedExercises } from './types';
import { Training } from '../../database/entities';
import { TrainingState, ExerciseState } from './training';

export function normalizeTrainings(payload: Training[]): NormalizedTrainings {
  return payload.reduce((
    normalized: NormalizedTrainings, { exercises = [], ...training }
  ): NormalizedTrainings => {
    const normalizedTraining: TrainingState = {
      ...training,
      isActive: false,
      exerciseIds: exercises.map(exercise => exercise.id)
    }

    const {
      exercises: normalizedExercises,
      exerciseSets: normalizedExerciseSets
    } = exercises.reduce((
      normalized: NormalizedExercises, { sets = [], ...exercise }
    ): NormalizedExercises => {
      const normalizedExercise: ExerciseState = {
        ...exercise,
        setIds: sets.map(set => set.id)
      }
      const normalizedSets = sets.map(set => ({ ...set }));

      return {
        exercises: [...normalized.exercises, normalizedExercise],
        exerciseSets: [...normalized.exerciseSets, ...normalizedSets]
      }
    }, { exercises: [], exerciseSets: [] });

    return {
      trainings: [...normalized.trainings, normalizedTraining],
      exercises: [...normalized.exercises, ...normalizedExercises],
      exerciseSets: [...normalized.exerciseSets, ...normalizedExerciseSets]
    }
  }, { trainings: [], exercises: [], exerciseSets: [] });
}