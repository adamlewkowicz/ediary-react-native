import React from 'react';
import { H4 } from '../../atoms';
import styled from 'styled-components/native';

interface RatioInfoProps {
  allowedDiff: number
  percentage: number
  total: number
}

export const RatioInfo = ({
  percentage: ratio,
  allowedDiff,
  total: value,
  ...textProps
}: RatioInfoProps) => {
  const parsedRatio = ratio - 100;
  const diffReverted = value * -1;
  const isBelowAllowed = parsedRatio > 0
    ? parsedRatio > allowedDiff
    : parsedRatio < (allowedDiff * -1);

  return (
    <Value isBelowAllowed={isBelowAllowed}>
      {diffReverted > 0 ? `+${diffReverted.toFixed(0)}` : diffReverted.toFixed(0)}
    </Value>
  );
}

const Value = styled(H4)<{
  isBelowAllowed: boolean
}>`
  color: ${props => props.theme.color[props.isBelowAllowed ? 'error' : 'success']};
`