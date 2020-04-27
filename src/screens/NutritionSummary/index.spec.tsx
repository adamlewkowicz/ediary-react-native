import React from 'react';
import { renderSetup } from '../../../test-utils';
import { NutritionSummaryScreen } from '.';

describe('<NutritionSummaryScreen />', () => {

  it('should render without crashing 💥', () => {
    renderSetup(<NutritionSummaryScreen />);
  });

});