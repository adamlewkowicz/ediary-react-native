import * as React from 'react';
import { FrameContainer } from '../components/FrameContainer';
import { TypeComponent } from '../components/TypeComponent';

export const TypeFrame = () => (
  <FrameContainer title="Type">
    <TypeComponent
      name="HeaderH1"
      fontSize={64}
    />
    <TypeComponent
      name="HeaderH2"
      fontSize={44}
    />
    <TypeComponent
      name="HeaderH3"
      fontSize={24}
    />
    <TypeComponent
      name="HeaderH4"
      fontSize={16}
    />

    <TypeComponent
      name="TextRegular"
      fontSize={16}
    />
    <TypeComponent
      name="TextSmall"
      fontSize={14}
    />
    <TypeComponent
      name="TextXSmall"
      fontSize={11}
    />
  </FrameContainer>
);