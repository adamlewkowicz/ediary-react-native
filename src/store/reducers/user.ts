import { WeightGoal, UserId, ProfileId } from '../../types';
import { UserActions } from '../actions';
import {
  APP_INITIALIZED,
  USER_PROFILE_CREATED
} from '../consts';

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
    case APP_INITIALIZED:
      const { profile, ...data } = action.payload.user;
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


interface UserPayload {}

export interface UserState extends UserPayload {
  data: null | {
    id: UserId
    login: string
  }
  profile: null | {
    id: ProfileId
    weight: number
    age: number
    gender: 'male' | 'female'
    weightGoal: WeightGoal
  }
  macroNeeds: {
    carbs: number
    prots: number
    fats: number
    kcal: number 
  }
}