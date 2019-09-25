import { MealProductAdded } from './diary';
import { ProductHistoryRecentLoaded } from '../creators';

export type ProductHistoryAction = 
  | MealProductAdded
  | ProductHistoryRecentLoaded