import React from 'react';
import { renderSetup, createNavigationCtxMock } from '../../../__tests__/utils';
import { AppLoading } from '.';

describe('<AppLoading />', () => {

  it('should render without crashing 💥', () => {
    const navigationStub: any = createNavigationCtxMock();
    renderSetup(<AppLoading navigation={navigationStub} />);
  });

});