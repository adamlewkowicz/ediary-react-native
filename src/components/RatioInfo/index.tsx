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
  const ratioWithout100 = ratio - 100;
  const diffReverted = value * -1;
  const isBelowAllowed = ratioWithout100 > 0
    ? ratioWithout100 > allowedDiff
    : ratioWithout100 < (allowedDiff * -1);

  return (
    <Text {...props} color={isBelowAllowed ? 'kcal' : 'carbs'}>
      ({diffReverted > 0 ? `+${diffReverted}` : diffReverted})
    </Text>
  );
}