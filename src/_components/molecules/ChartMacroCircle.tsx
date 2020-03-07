import React from 'react';
import styled from 'styled-components/native';
import { ChartCircle, ChartCircleProps } from './ChartCircle';
import { H4, TextPrimary } from '../atoms/Text';

interface ChartMacroCircleProps extends ChartCircleProps {
  title: string
  value: number
}

export const ChartMacroCircle = (props: ChartMacroCircleProps) => {
  return (
    <Container>
      <ChartCircle
        percentages={props.percentages}
        gradientColors={props.gradientColors}
      >
        <H4>{props.percentages}%</H4>
      </ChartCircle>
      <TextPrimary>{props.value}g</TextPrimary>
      <H4>{props.title}</H4>
    </Container>
  );
}

const Container = styled.View`
  align-items: center;
`