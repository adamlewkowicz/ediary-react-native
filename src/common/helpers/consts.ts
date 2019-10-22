import { MacroElements } from '../../types';
import { DiaryTemplate } from '../../store/reducers/diary';

export const baseMacro: MacroElements = {
  carbs: 0,
  prots: 0,
  fats: 0,
  kcal: 0
}

export const defaultTemplates = [
  {
    id: 1,
    name: 'Śniadanie I',
    time: '08:30:00',
  },
  {
    id: 2,
    name: 'Śniadanie II',
    time: '11:00:00',
  },
  {
    id: 3,
    name: 'Obiad',
    time: '13:00:00',
  },
  {
    id: 4,
    name: 'Podwieczorek',
    time: '17:00:00',
  },
  {
    id: 5,
    name: 'Kolacja',
    time: '19:00:00',
  },
] as any as DiaryTemplate[];