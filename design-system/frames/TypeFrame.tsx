import * as React from 'react';
import { FrameContainer } from '../components/FrameContainer';
import { TypeComponent } from '../components/TypeComponent';
import { theme } from '../../src/common/theme';

export const TypeFrame = () => (
  <FrameContainer title="Type">
    <TypeComponent
      name="HeaderH1"
      fontWeight="light"
      fontSize={theme.fontSize.h1}
    />
    <TypeComponent
      name="HeaderH2"
      fontWeight="light"
      fontSize={theme.fontSize.h2}
    />
    <TypeComponent
      name="HeaderH3"
      fontWeight="light"
      fontSize={theme.fontSize.h3}
    />

    <TypeComponent
      name="TextRegular"
      fontSize={theme.fontSize.regular}
    />
    <TypeComponent
      name="TextSmall"
      fontSize={theme.fontSize.small}
    />


    <TypeComponent
      name="TextRegularSecondary"
      color={theme.color.secondary}
      fontSize={theme.fontSize.regular}
    />
    <TypeComponent
      name="TextRegularQuaternary"
      color={theme.color.quaternary}
      fontSize={theme.fontSize.regular}
    />
    <TypeComponent
      name="TextRegularQuinary"
      color={theme.color.quinary}
      fontSize={theme.fontSize.regular}
    />
  </FrameContainer>
);