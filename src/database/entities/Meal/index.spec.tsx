import { Meal } from '.';
import { getDayFromDate } from '../../../common/utils';
import dayjs from 'dayjs';
import { DATE_FORMAT } from '../../../common/consts';

test('Meal.getMacroSummary - groups meals by day and returns summed macro values', async () => {
  const dayAMock = '2019-01-01';
  const dayBMock = '2019-01-03';

  const dateA = new Date(dayAMock);
  const dateB = new Date(dayBMock);

  const dateAString = dayjs(dateA).format(DATE_FORMAT);
  const dateBString = dayjs(dateB).format(DATE_FORMAT);

  await Meal.save({ name: 'A1', date: dateAString, macro: { carbs: 40, kcal: 10 }});
  await Meal.save({ name: 'A2', date: dateAString, macro: { carbs: 40, kcal: 10 }});
  await Meal.save({ name: 'B1', date: dateBString, macro: { carbs: 40, kcal: 10 }});

  const result = await Meal.getMacroSummary(getDayFromDate(dateA));

  expect(result).toEqual([
    {
      day: dayAMock,
      carbs: 80,
      prots: 0,
      fats: 0,
      kcal: 20
    },
    {
      day: dayBMock,
      carbs: 40,
      prots: 0,
      fats: 0,
      kcal: 10
    }
  ]);
});