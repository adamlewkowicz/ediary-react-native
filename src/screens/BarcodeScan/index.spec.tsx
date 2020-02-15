import React from 'react';
import { renderSetup, createNavigationCtxMock } from '../../../__tests__/utils';
import { BarcodeScan } from '.';

describe('<BarcodeScan />', () => {

  it('should render without crashing 💥', () => {
    const navigationStub: any = createNavigationCtxMock();
    renderSetup(<BarcodeScan navigation={navigationStub} />);
  });

});