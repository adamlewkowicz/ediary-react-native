import { MacroElements } from '../../types';
import { MealTemplate } from '../../store/reducers/diary';

export const baseMacro: MacroElements = {
  carbs: 0,
  prots: 0,
  fats: 0,
  kcal: 0
}

export const defaultTemplates = [
  {
    id: -1,
    name: 'Śniadanie I',
    dateTime: '08:30:00',
    dateTimeBase: '08:30',
  },
  {
    id: -2,
    name: 'Śniadanie II',
    dateTime: '11:00:00',
    dateTimeBase: '11:00',
  },
  {
    id: -3,
    name: 'Obiad',
    dateTime: '13:00:00',
    dateTimeBase: '13:00',
  },
  {
    id: -4,
    name: 'Podwieczorek',
    dateTime: '17:00:00',
    dateTimeBase: '17:00',
  },
  {
    id: -5,
    name: 'Kolacja',
    dateTime: '19:00:00',
    dateTimeBase: '19:00',
  },
] as any as MealTemplate[];