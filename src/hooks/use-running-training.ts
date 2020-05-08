import { useDispatch, useSelector } from 'react-redux';
import { Selectors, Actions } from '../store';

export const useRunningTraining = () => {
  const dispatch = useDispatch();
  const data = useSelector(Selectors.getRunningTraining);

  const start = () => {
    dispatch(Actions.runningTrainingStart());
  }

  const finish = () => {
    dispatch(Actions.runningTrainingFinish());
  }

  const pause = () => {
    dispatch(Actions.runningTrainingPause());
  }

  const unpause = () => {
    dispatch(Actions.runningTrainingUnpause());
  }

  return { data, start, finish, pause, unpause };
}