import React from 'react';
import { ProfileCreate } from '.';
import { render } from '@testing-library/react-native';
import { App } from '../../../__tests__/utils';
import { NavigationContext } from 'react-navigation';

test('renders without crashing', () => {
  const navigationMock: any = {
    navigate: jest.fn()
  }

  const { container } = render(
    <App>
      <NavigationContext.Provider value={navigationMock}>
        <ProfileCreate />
      </NavigationContext.Provider>
    </App>
  );

  expect(container).toMatchSnapshot();
});