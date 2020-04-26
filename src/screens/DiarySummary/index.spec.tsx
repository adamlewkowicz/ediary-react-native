import React from 'react';
import { renderSetup } from '../../../test-utils';
import { DiarySummaryScreen } from '.';

describe('<DiarySummaryScreen />', () => {

  it('should render without crashing 💥', () => {
    renderSetup(<DiarySummaryScreen />);
  });

});