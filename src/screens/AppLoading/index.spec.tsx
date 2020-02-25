import React from 'react';
import { renderSetup, createNavigationCtxMock } from '../../../__tests__/utils';
import { AppLoadingScreen } from '.';
import { wait } from '@testing-library/react-native';

describe('<AppLoading />', () => {

  it('should render without crashing 💥', () => {
    renderSetup(<AppLoadingScreen />);
  });

  describe('when user has no profile', () => {

    it('should navigate to profile create screen 🧭', async () => {
      const navigationMock = createNavigationCtxMock();
      renderSetup(<AppLoadingScreen />);

      await wait(() => {
        expect(navigationMock.navigate).toHaveBeenCalledTimes(1);
        expect(navigationMock.navigate).toHaveBeenCalledWith('ProfileCreate');
      });
    });

  });

  describe('when has profile created', () => {

    it.todo('should navigate to main screen 🧭');

  });

});