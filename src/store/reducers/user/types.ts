import { UserId, ProfileId, WeightGoal } from '../../../types';

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