import React from 'react';
import { renderSetup } from '../../../__tests__/utils';
import { AppLoadingScreen } from '.';
import { configureStore } from '../../store';

describe('<AppLoadingScreen />', () => {

  it('should render without crashing 💥', () => {
    const store = configureStore();
    renderSetup(<AppLoadingScreen />, { store });
  });

  // TODO: Move below specs to RootStack test
  
  describe('when user has no profile', () => {

    it.todo('should change app status to creating profile');

  });

  describe('when user has profile', () => {

    it.todo('should change app status to creating initialized');

  });

});