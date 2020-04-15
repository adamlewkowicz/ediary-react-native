import * as React from 'react';
import { FrameContainer } from '../components/FrameContainer';
import { TypeComponent } from '../components/TypeComponent';
import { THEME } from '../../src/common/theme';

export const TypeFrame = () => (
  <FrameContainer title="Type">
    <TypeComponent
      name="HeaderH1"
      fontWeight="light"
      fontSize={THEME.fontSizeRaw.h1}
    />
    <TypeComponent
      name="HeaderH2"
      fontWeight="light"
      fontSize={THEME.fontSizeRaw.h2}
    />
    <TypeComponent
      name="HeaderH3"
      fontWeight="light"
      fontSize={THEME.fontSizeRaw.h3}
    />

    <TypeComponent
      name="TextRegular"
      fontSize={THEME.fontSizeRaw.regular}
    />
    <TypeComponent
      name="TextSmall"
      fontSize={THEME.fontSizeRaw.small}
    />


    <TypeComponent
      name="TextRegularSecondary"
      color={THEME.color.secondary}
      fontSize={THEME.fontSizeRaw.regular}
    />
    <TypeComponent
      name="TextRegularQuaternary"
      color={THEME.color.quaternary}
      fontSize={THEME.fontSizeRaw.regular}
    />
    <TypeComponent
      name="TextRegularQuinary"
      color={THEME.color.quinary}
      fontSize={THEME.fontSizeRaw.regular}
    />
  </FrameContainer>
);