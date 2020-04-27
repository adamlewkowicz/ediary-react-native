import React from 'react';
import { Defs, LinearGradient, Stop } from 'react-native-svg';

interface SvgGradientDefProps {
  id: string
  colors: readonly [string, string]
  stopOpacity?: readonly [number, number]
  index?: number
}

export const SvgGradientDef = (props: SvgGradientDefProps) => {
  const { stopOpacity = [1, 1] } = props;

  return (
    <Defs key={props.index}>
      <LinearGradient id={props.id} x1="0%" y1="0%" x2="100%" y2="0%">
        <Stop
          offset="0%"
          stopColor={props.colors[0]}
          stopOpacity={stopOpacity[0]}
        />
        <Stop
          offset="100%"
          stopColor={props.colors[1]}
          stopOpacity={stopOpacity[1]}
        />
      </LinearGradient>
    </Defs>
  );
}