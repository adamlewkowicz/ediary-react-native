import React from 'react';
import styled from 'styled-components/native';
import { ChartCircle, ChartCircleProps } from './ChartCircle';
import { H4 } from '../Text';
import { TextSplit } from '../Text/TextSplit';

interface ChartMacroCircleLeftProps extends ChartCircleProps {
  title: string
  value: number
  valueLeft: number
}

export const ChartMacroCircleLeft = (props: ChartMacroCircleLeftProps) => {
  return (
    <Container>
      <ChartCircle
        percentage={props.percentage}
        gradientColors={props.gradientColors}
      >
        <H4>{props.percentage}%</H4>
      </ChartCircle>
      <TextSplit
        primary={props.value.toFixed(0)}
        secondary={props.valueLeft.toFixed(0)}
      />
      <H4>{props.title}</H4>
    </Container>
  );
}

const Container = styled.View`
  align-items: center;
`