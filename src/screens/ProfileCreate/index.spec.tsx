import React from 'react';
import { ProfileCreate } from '.';
import { render } from '@testing-library/react-native';
import { App } from '../../../__tests__/utils';

test('renders without crashing', () => {
  const navigationMock: any = {
    navigate: jest.fn()
  }

  const { container } = render(
    <App>
      <ProfileCreate navigation={navigationMock} />
    </App>
  );

  expect(container).toMatchSnapshot();
});