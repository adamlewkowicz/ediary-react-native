import { GYM_TRAINING_STARTED } from '../../consts';

export const gymTrainingStarted = () => ({
  type: GYM_TRAINING_STARTED
});

export type GymTrainingAction = 
  | ReturnType<typeof gymTrainingStarted>