import React from 'react';
import { renderSetup } from '../../../__tests__/utils';
import { BarcodeScanScreen } from '.';

describe('<BarcodeScanScreen />', () => {

  it('should render without crashing 💥', () => {
    renderSetup(<BarcodeScanScreen />);
  });

});