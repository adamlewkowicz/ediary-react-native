import * as React from 'react';
import { FrameContainer } from '../components/FrameContainer';
import { TypeComponent } from '../components/TypeComponent';
import { THEME } from '../../src/common/theme';

export const TypeFrame = () => (
  <FrameContainer title="Type">
    <TypeComponent
      name="HeaderH1"
      fontWeight="light"
      fontSize={THEME.fontSize.h1}
    />
    <TypeComponent
      name="HeaderH2"
      fontWeight="light"
      fontSize={THEME.fontSize.h2}
    />
    <TypeComponent
      name="HeaderH2"
      fontWeight="light"
      fontSize={THEME.fontSize.h3}
    />

    <TypeComponent
      name="TextRegular"
      fontSize={THEME.fontSize.regular}
    />
    <TypeComponent
      name="TextSmall"
      fontSize={THEME.fontSize.small}
    />


    <TypeComponent
      name="TextRegularSecondary"
      color={THEME.color.secondary}
      fontSize={THEME.fontSize.regular}
    />
    <TypeComponent
      name="TextRegularQuinary"
      color={THEME.color.quinary}
      fontSize={THEME.fontSize.regular}
    />
  </FrameContainer>
);