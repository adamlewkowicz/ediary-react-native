import React from 'react';
import { Defs, LinearGradient, Stop } from 'react-native-svg';

interface SvgGradientDefProps {
  id: string
  colors: readonly [string, string]
}

export const SvgGradientDef = (props: SvgGradientDefProps) => (
  <Defs>
    <LinearGradient id={props.id} x1="0%" y1="0%" x2="100%" y2="0%">
      <Stop
        offset="0%"
        stopColor={props.colors[0]}
        stopOpacity="1"
      />
      <Stop
        offset="100%"
        stopColor={props.colors[1]}
        stopOpacity="1"
      />
    </LinearGradient>
  </Defs>
);