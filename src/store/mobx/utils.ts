import { NormalizedTrainings, NormalizedExercises } from './types';
import { Training } from '../../database/entities';
import { TrainingState, ExerciseState, ExerciseSetState } from './training';

export function normalizeTrainings(payload: Training[]): NormalizedTrainings {
  return payload.reduce((
    normalized: NormalizedTrainings,
    trainingEntity
  ): NormalizedTrainings => {
    const { exercises = [], ...training } = trainingEntity;
    
    const normalizedTraining: TrainingState = {
      ...training,
      isActive: false,
      exerciseIds: exercises.map(exercise => exercise.id)
    }

    const {
      exercises: normalizedExercises,
      exerciseSets: normalizedExerciseSets
    } = exercises.reduce((
      normalized: NormalizedExercises,
      exerciseEntity,
    ): NormalizedExercises => {
      const { sets = [], ...exercise } = exerciseEntity;

      const normalizedExercise: ExerciseState = {
        ...exercise,
        setIds: sets.map(set => set.id),
      }
      const normalizedSets: ExerciseSetState[] = sets.map(set => ({ ...set }));

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