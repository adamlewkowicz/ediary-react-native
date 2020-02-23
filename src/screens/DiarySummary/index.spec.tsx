import React from 'react';
import { renderSetup } from '../../../__tests__/utils';
import { DiarySummaryScreen } from '.';

describe('<DiarySummary />', () => {

  it('should render without crashing 💥', () => {
    renderSetup(<DiarySummaryScreen />);
  });

  it.todo('should display average macro from last week');

});