import { Meal } from '.';
import { getDayFromDate } from '../../../common/utils';
import dayjs from 'dayjs';
import { DATE_FORMAT } from '../../../common/consts';

test('Meal.getMacroSummary - groups meals by day and returns summed macro values', async () => {
  const dayMock = '2019-01-01';
  const nextDayMock = '2019-01-02';

  const date = new Date(dayMock);
  const nextDayDate = new Date(nextDayMock);

  const dateString = dayjs(date).format(DATE_FORMAT);
  const nextDayDateString = dayjs(nextDayDate).format(DATE_FORMAT);

  await Meal.save({ name: 'A', date: dateString, macro: { carbs: 40, kcal: 10 }});
  await Meal.save({ name: 'B', date: dateString, macro: { carbs: 40, kcal: 10 }});
  await Meal.save({ name: 'C', date: nextDayDateString, macro: { carbs: 40, kcal: 10 }});

  const result = await Meal.getMacroSummary(getDayFromDate(date));

  expect(result).toEqual([
    {
      day: dayMock,
      carbs: 80,
      prots: 0,
      fats: 0,
      kcal: 20
    },
    {
      day: nextDayMock,
      carbs: 40,
      prots: 0,
      fats: 0,
      kcal: 10
    }
  ]);
});