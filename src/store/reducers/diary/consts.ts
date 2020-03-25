import { MealTemplate } from './types';

export const DEFAULT_MEAL_TEMPLATES = [
  {
    id: -1,
    name: 'Śniadanie I',
    time: '08:30:00',
    timeBase: '08:30',
  },
  {
    id: -2,
    name: 'Śniadanie II',
    time: '11:00:00',
    timeBase: '11:00',
  },
  {
    id: -3,
    name: 'Obiad',
    time: '13:00:00',
    timeBase: '13:00',
  },
  {
    id: -4,
    name: 'Podwieczorek',
    time: '17:00:00',
    timeBase: '17:00',
  },
  {
    id: -5,
    name: 'Kolacja',
    time: '19:00:00',
    timeBase: '19:00',
  },
] as any as MealTemplate[];