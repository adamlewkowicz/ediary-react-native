import React from 'react';
import styled from 'styled-components/native';
import { ChartCircle, ChartCircleProps } from './ChartCircle';
import { H4, TextPrimary } from '../atoms/Text';
import { TextSplit } from './TextSplit';

interface ChartMacroCircleProps extends ChartCircleProps {
  title: string
  value: number
  valueLeft?: number
}

export const ChartMacroCircle = (props: ChartMacroCircleProps) => {
  const renderValue = props.valueLeft != null ? (
    <TextSplit
      primary={props.value}
      secondary={props.valueLeft}
    />
  ) : (
    <TextPrimary>{props.value}g</TextPrimary>
  );

  return (
    <Container>
      <ChartCircle
        percentages={props.percentages}
        gradientColors={props.gradientColors}
      >
        <H4>{props.percentages}%</H4>
      </ChartCircle>
      {renderValue}
      <H4>{props.title}</H4>
    </Container>
  );
}

const Container = styled.View`
  align-items: center;
`