import { UserState } from './types';
import { UserActions } from '../../actions';
import {
  USER_PROFILE_CREATED,
  USER_INITIALIZED,
} from '../../consts';

const initialState: UserState = {
  data: null,
  profile: null,
  macroNeeds: {
    carbs: 0,
    prots: 0,
    fats: 0,
    kcal: 0
  }
}

export function userReducer(
  state = initialState,
  action: UserActions
): UserState {
  switch(action.type) {
    case USER_INITIALIZED:
      const { profile, ...data } = action.payload;
      return {
        ...state,
        ...profile && {
          macroNeeds: profile.macroNeeds,
          profile: {
            ...profile,
            gender: profile.male ? 'male' : 'female'
          }
        },
        data
      }
    case USER_PROFILE_CREATED: {
      const { macroNeeds, ...profile } = action.payload;
      return {
        ...state,
        profile: {
          ...profile,
          gender: profile.male ? 'male' : 'female'
        },
        macroNeeds
      }
    }
    default: return state;
  }
}