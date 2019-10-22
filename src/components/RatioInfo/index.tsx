import React from 'react';
import { Text, TextProps } from '../Elements';

interface RatioInfoProps extends TextProps {
  allowedDiff: number
  ratio: number
  value: number
}

export const RatioInfo = ({
  ratio,
  allowedDiff,
  value,
  ...props
}: RatioInfoProps) => {
  const parsedRatio = ratio - 100;
  const diffReverted = value * -1;
  const isBelowAllowed = parsedRatio > 0
    ? parsedRatio > allowedDiff
    : parsedRatio < (allowedDiff * -1);

  return (
    <Text color={isBelowAllowed ? 'kcal' : 'carbs'} {...props}>
      ({diffReverted > 0 ? `+${diffReverted}` : diffReverted})
    </Text>
  );
}