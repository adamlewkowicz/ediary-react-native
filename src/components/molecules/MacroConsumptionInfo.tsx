import React from 'react';
import styled from 'styled-components/native';
import { TextPrimary, TextSplit } from '../atoms';
import { RatioInfo as NativeRatioInfo } from './RatioInfo';
import { MacroNeed } from '../../utils';

interface NutritionDiffProps {
  title: string
  unit: string
  value: number
  macroNeed: MacroNeed
}

export const MacroConsumptionInfo = (props: NutritionDiffProps) => (
  <Container accessibilityLabel="Średnie spożycie makroskładniku">
    <TextPrimary>{props.title}</TextPrimary>
    <Details>
      <TextSplit
        current={props.value.toFixed(0)}
        total={`${props.macroNeed.needed.toFixed(0)}g`}
      />
      <RatioInfo
        allowedDiff={15}
        percentage={props.macroNeed.percentage}
        total={props.macroNeed.left}
      />
    </Details>
  </Container>
);

const Container = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin: ${props => props.theme.spacing.tinyVertical};
`

const Details = styled.View`
  justify-content: flex-end;
  align-items: flex-end;
`

const RatioInfo = styled(NativeRatioInfo)`
  font-size: ${props => props.theme.fontSize.small};
`