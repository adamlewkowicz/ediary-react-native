import { Meal } from '.';
import { getDayFromDate } from '../../../common/utils';
import dayjs from 'dayjs';
import { DATE_FORMAT } from '../../../common/consts';

test('Meal.getMacroHistory - groups meals by day and returns summed macro values sorted ascendingly by day', async () => {
  const startDateMock = '2019-01-07';
  const endDateMock = '2019-01-01';
  const daysInWeek = 7;

  const startDate = new Date(startDateMock);
  const endDate = new Date(endDateMock);

  const startDateString = dayjs(startDate).format(DATE_FORMAT);
  const endDateString = dayjs(endDate).format(DATE_FORMAT);

  const mealA1 = await Meal.save({ name: 'A1', date: startDateString, macro: { carbs: 40, kcal: 10 }});
  const mealA2 = await Meal.save({ name: 'A2', date: startDateString, macro: { carbs: 40, kcal: 10 }});
  const mealB1 = await Meal.save({ name: 'B1', date: endDateString, macro: { carbs: 81, kcal: 10 }});

  const result = await Meal.getMacroHistory(getDayFromDate(startDate));
  const [firstRecord] = result;
  const lastRecord = result[result.length - 1];

  expect(result.length).toEqual(daysInWeek);
  expect(lastRecord.day).toEqual(startDateMock);
  expect(lastRecord.carbs).toEqual(mealA1.macro.carbs + mealA2.macro.carbs);
  expect(lastRecord.prots).toEqual(0);
  expect(firstRecord.carbs).toEqual(mealB1.macro.carbs);
});

test('Meal.getMacroSummary - returns macro history and calculates average values', async () => {
  const dayAMock = '2019-01-06';
  const dayBMock = '2019-01-03';

  const dateA = new Date(dayAMock);
  const dateB = new Date(dayBMock);

  const dateAString = dayjs(dateA).format(DATE_FORMAT);
  const dateBString = dayjs(dateB).format(DATE_FORMAT);

  await Meal.save({ name: 'A1', date: dateAString, macro: { carbs: 40, kcal: 10 }});
  await Meal.save({ name: 'A2', date: dateAString, macro: { carbs: 40, kcal: 10 }});
  await Meal.save({ name: 'B1', date: dateBString, macro: { carbs: 40, kcal: 10 }});

  const result = await Meal.getMacroSummary(getDayFromDate(dateA));

  expect(result).toMatchSnapshot();
});