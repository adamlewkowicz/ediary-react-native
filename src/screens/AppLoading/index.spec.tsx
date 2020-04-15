import React from 'react';
import { renderSetup } from '../../../test-utils';
import { AppLoadingScreen } from '.';
import { configureStore } from '../../store';

describe('<AppLoadingScreen />', () => {

  it('should render without crashing 💥', () => {
    const store = configureStore();
    renderSetup(<AppLoadingScreen />, { store });
  });

});