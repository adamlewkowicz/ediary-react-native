import dayjs from 'dayjs';

const date = new Date;

const initialState: AppReducerState = {
  date,
  day: dayjs(date).format('YYYY-MM-DD')
}

export function applicationReducer(
  state = initialState,
  action: any
) {
  switch(action.type) {
    default: return state;
  }
}

interface AppReducerState {
  date: Date
  day: string
}