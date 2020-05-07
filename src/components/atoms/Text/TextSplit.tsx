import React, { ReactText } from 'react';
import { TextTertiary, H2 } from '.';

interface TextSplitProps {
  current: ReactText
  total: ReactText
}

export const TextSplit = (props: TextSplitProps) => (
  <H2>
    {props.current}
    <TextTertiary>
      {' '}/ {props.total}
    </TextTertiary>
  </H2>
);