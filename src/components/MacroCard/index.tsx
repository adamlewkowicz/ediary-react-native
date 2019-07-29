import React from 'react';
import styled from 'styled-components/native';
import { ProgressBar } from '../ProgressBar';
import { TextMeta } from '../Elements';

interface MacroCardProps {
  colors: string[],
  title: string
  value: string | number
  percentages: number
}
export const MacroCard = (props: MacroCardProps) => {
  return (
    <Container>
      <Title>{props.title}</Title>
      <TextMeta
        value={props.value}
        meta="g"
        valueFontSize={25}
        metaFontSize={12}
        marginTop="4px"
        marginBottom="4px"
      />
      <ProgressBar
        colors={props.colors}
        percentages={props.percentages}
      />
    </Container>
  );
}

const Container = styled.View`
  display: flex;
  justify-content: center;
  width: 100px;
`

const Title = styled.Text`
  text-align: center;
  font-size: 16px;
  color: #B0B0B0;
`