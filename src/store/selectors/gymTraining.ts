import { StoreState } from '..';
import { createSelector } from 'reselect';

const getTrainings = (state: StoreState) => state.gymTraining.trainings;
const getExerciseSets = (state: StoreState) => state.gymTraining.exerciseSets;
const getExercises = (state: StoreState) => state.gymTraining.exercises;

export const getActiveTraining = createSelector(
  getTrainings,
  trainings => trainings.filter(training => training.isActive)
);

export const getActiveExerciseSet = createSelector(
  getExerciseSets,
  exerciseSets => exerciseSets.find(exerciseSet => exerciseSet.state === 'active')
);

export const getNextExerciseSet = createSelector(
  getExerciseSets,
  exerciseSets => exerciseSets.find(exerciseSet => exerciseSet.state === 'unfinished')
);

const getActiveExercise = createSelector(
  getActiveExerciseSet,
  getExercises,
  (activeExerciseSet, exercises) => exercises.find(exercise => exercise.id === activeExerciseSet?.exerciseId)
);