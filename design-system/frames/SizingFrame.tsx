import * as React from 'react';
import { FrameContainer } from '../components/FrameContainer';
import { SizingComponent } from '../components/SizingComponent';
import { THEME } from '../../src/common/theme';

interface SizingFrameProps {

}

export const SizingFrame = (props: SizingFrameProps) => {
  return (
    <FrameContainer title="Spacing">
      {Object.entries(THEME.spacingRaw).map(([name, size]) => (
        <SizingComponent
          key={name}
          name={name + size}
          size={size}
        />
      ))}
    </FrameContainer>
  );
}
