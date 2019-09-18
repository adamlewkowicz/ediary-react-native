import React from 'react';
import { render, within } from '@testing-library/react-native';
import { App } from '../../../__tests__/utils';
import { Meal } from '../../database/entities';

test('displays average macro from last week', async () => {
  const mealAMock = await Meal.save({ name: 'Sugar', macro: { carbs: 10, kcal: 130 }});
  const daysInWeek = 7;
  const kcalAverage = Math.round(mealAMock.macro.kcal / daysInWeek);
  const carbsAverage = Math.round(mealAMock.macro.carbs / daysInWeek);

  const { findAllByLabelText, } = render(<App stack="DiarySummary" />);

  const [averageCarbsInfo,,, averageKcalInfo] = await findAllByLabelText('Średnia wartość makroskładniku');
  
  await within(averageCarbsInfo).findByText(carbsAverage.toString());
  await within(averageKcalInfo).findByText(kcalAverage.toString());
});