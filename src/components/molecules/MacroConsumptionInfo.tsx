import React from 'react';
import styled from 'styled-components/native';
import { TextPrimary, TextTertiary, H2, H1 } from '../atoms';
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
      <H1>
        {props.value.toFixed(0)} 
        <LeftValue> / {props.macroNeed.needed.toFixed(0)} </LeftValue>
        <TextTertiary>{props.unit}</TextTertiary>
      </H1>
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

const LeftValue = styled(H2)`
  color: ${props => props.theme.color.tertiary};
`

const RatioInfo = styled(NativeRatioInfo)`
  font-size: ${props => props.theme.fontSize.small};
`