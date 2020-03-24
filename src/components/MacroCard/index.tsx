import React from 'react';
import styled from 'styled-components/native';
import { ProgressBar } from '../../_components/molecules/ProgressBar';
import { Block } from '../../_components/legacy/Elements';

interface MacroCardProps {
  colors: readonly string[],
  title: string
  reached: string | number
  goal: number
  percentages: number
}

export const MacroCard = (props: MacroCardProps) => {
  return (
    <Container>
      <Block align="flex-end" space="center">
        <Eaten>{props.reached}</Eaten>
        <Slash>/</Slash>
        <Needed>{props.goal}</Needed>
      </Block>
      <ProgressBar
        colors={props.colors}
        percentages={props.percentages}
        marginVertical={8}
      />
      <Title>{props.title} (G)</Title>
    </Container>
  );
}

const Container = styled.View`
  display: flex;
  justify-content: center;
  width: 100px;
`

const Eaten = styled.Text`
  font-family: ${props => props.theme.fontWeight.regular};
  font-size: ${props => props.theme.fontSize.largeXL};
`

const Needed = styled.Text`
  font-size: ${props => props.theme.fontSize.regular};
  font-family: ${props => props.theme.fontWeight.regular};
  color: ${props => props.theme.color.gray20};
`

const Slash = styled.Text`
  color: ${props => props.theme.color.gray20};
  margin: 0 4px;
`

const Title = styled.Text`
  font-family: ${props => props.theme.fontWeight.regular};
  color: ${props => props.theme.color.gray20};
  text-align: center;
  font-size: ${props => props.theme.fontSize.tiny};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`