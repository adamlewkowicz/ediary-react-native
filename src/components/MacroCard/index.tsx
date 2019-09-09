import React from 'react';
import styled from 'styled-components/native';
import { ProgressBar } from '../ProgressBar';
import { Block } from '../Elements';

interface MacroCardProps {
  colors: string[],
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
  font-family: ${props => props.theme.font.regular};
  font-size: 20px;
`

const Needed = styled.Text`
  font-size: 13px;
  font-family: ${props => props.theme.font.regular};
  color: ${props => props.theme.colors.midGray};
`

const Slash = styled.Text`
  color: ${props => props.theme.colors.midGray};
  margin: 0 4px;
`

const Title = styled.Text`
  font-family: ${props => props.theme.font.regular};
  color: ${props => props.theme.colors.midGray};
  text-align: center;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`