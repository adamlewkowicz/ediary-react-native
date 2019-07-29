
interface ApplicationReducerState {
  date: Date
}

const initialState: ApplicationReducerState = {
  date: new Date
}

export function applicationReducer(
  state = initialState,
  action: any
) {
  switch(action.type) {
    default: return state;
  }
}