import React from 'react';
import { renderSetup } from '../../../test-utils';
import { BarcodeScanScreen } from '.';

describe('<BarcodeScanScreen />', () => {

  it('should render without crashing 💥', () => {
    renderSetup(<BarcodeScanScreen />);
  });

});