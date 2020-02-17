import React from 'react';
import { ProfileCreate } from '.';
import { renderSetup } from '../../../__tests__/utils';

describe('<ProfileCreate />', () => {
  
  it('should render without crashing 💥', () => {
    renderSetup(<ProfileCreate />);
  });

  it.todo('should create new profile');

});