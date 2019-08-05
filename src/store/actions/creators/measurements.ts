import { MeasPayload } from '../../reducers/measurements';
import { MEAS_DATA_UPDATED } from '../../consts';
import { MeasDataUpdated } from '../types';

export const measDataUpdated = (
  data: Partial<MeasPayload>
): MeasDataUpdated => ({
  type: MEAS_DATA_UPDATED,
  payload: data
});