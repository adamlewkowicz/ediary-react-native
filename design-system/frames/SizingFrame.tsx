import * as React from 'react';
import { FrameContainer } from '../components/FrameContainer';
import { SizingComponent } from '../components/SizingComponent';
import { spacing_V2 } from '../../src/common/theme';

interface SizingFrameProps {

}

export const SizingFrame = (props: SizingFrameProps) => {
  return (
    <FrameContainer title="Spacing">
      {Object.entries(spacing_V2).map(([name, size]) => (
        <SizingComponent
          key={name}
          name={name}
          size={size}
        />
      ))}
    </FrameContainer>
  );
}
