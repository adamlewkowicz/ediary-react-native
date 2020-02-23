import React from 'react';
import { ProfileCreateScreen } from '.';
import { renderSetup } from '../../../__tests__/utils';

describe('<ProfileCreate />', () => {
  
  it('should render without crashing 💥', () => {
    renderSetup(<ProfileCreateScreen />);
  });

  it.todo('should create new profile');

});