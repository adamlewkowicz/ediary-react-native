import { DateDay } from '../../../types';

export type GetMacroHistoryResult = {
  day: DateDay
  carbs: number
  prots: number
  fats: number
  kcal: number
}

export type GetMacroSummaryResult = {
  data: GetMacroHistoryResult[]
  average: {
    carbs: number
    prots: number
    fats: number
    kcal: number
  }
}