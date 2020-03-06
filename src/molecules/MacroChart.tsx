import React from 'react';
import styled from 'styled-components/native';
import { CircleChart } from './CircleChart';
import { H4, TextPrimary } from '../elements/Text';
import { theme } from '../common/theme';

interface MacroChartProps {
  value: number
  percentages: number
  title: string
}

export const MacroChart = (props: MacroChartProps) => {
  return (
    <Container>
      <CircleChart
        percentages={props.percentages}
        gradientColors={theme.gradient.kcal}
      >
        <H4>{props.percentages}%</H4>
      </CircleChart>
      <TextPrimary>{props.value}g</TextPrimary>
      <H4>{props.title}</H4>
    </Container>
  );
}

const Container = styled.View`
  align-items: center;
`