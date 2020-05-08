import { useDispatch, useSelector } from 'react-redux';
import { Selectors, Actions } from '../store';

export const useRunningTraining = () => {
  const dispatch = useDispatch();
  const data = useSelector(Selectors.getRunningTraining);

  const pauseToggle = (status: boolean = !data.isPaused) => {
    dispatch(Actions.runningTrainingPauseToggle(status));
  }

  const start = () => {
    dispatch(Actions.runningTrainingStart());
  }

  const finish = () => {
    dispatch(Actions.runningTrainingFinish());
  }

  return { data, start, finish, pauseToggle };
}