import React from 'react';
import { render } from '@testing-library/react-native';
import { App } from '../../../__tests__/utils';

test('renders without crashing', () => {
  const { container } = render(<App screen="BarcodeScan" />);
  expect(container).toMatchSnapshot();
});