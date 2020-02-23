import React from 'react';
import { renderSetup, createNavigationCtxMock } from '../../../__tests__/utils';
import { BarcodeScanScreen } from '.';

describe('<BarcodeScan />', () => {

  it('should render without crashing 💥', () => {
    const navigationStub: any = createNavigationCtxMock();
    renderSetup(<BarcodeScanScreen navigation={navigationStub} />);
  });

});