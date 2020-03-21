import { useSelector, useDispatch } from 'react-redux';
import { Selectors, Actions } from '../store';

export const useAppDate = () => {
  const dispatch = useDispatch();
  const appDate = useSelector(Selectors.getAppDate);
  const appDateDay = useSelector(Selectors.getAppDay)

  const update = (nextDate: Date) => {
    dispatch(Actions.appDateUpdated(nextDate));
  }

  return { appDate, appDateDay, update };
}