import React from 'react';
import { renderSetup } from '../../../__tests__/utils';
import { DiarySummary } from '.';

describe('<DiarySummary />', () => {

  it('should render without crashing', () => {
    renderSetup(<DiarySummary />);
  });

  it.todo('should display average macro from last week');

});