import { MEAS_DATA_UPDATED } from '../../consts';
import { MeasPayload } from '../../reducers/measurements';

export type MeasDataUpdated = {
  type: typeof MEAS_DATA_UPDATED
  payload: Partial<MeasPayload>
}

export type MeasurementActions = 
  | MeasDataUpdated