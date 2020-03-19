import React from 'react';
import styled from 'styled-components/native';
import { ChartCircle, ChartCircleProps } from './ChartCircle';
import { H4 } from '../atoms/Text';
import { TextSplit } from './TextSplit';

interface ChartMacroCircleLeftProps extends ChartCircleProps {
  title: string
  value: number
  valueLeft: number
}

export const ChartMacroCircleLeft = (props: ChartMacroCircleLeftProps) => {
  return (
    <Container>
      <ChartCircle
        percentages={props.percentages}
        gradientColors={props.gradientColors}
      >
        <H4>{props.percentages}%</H4>
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