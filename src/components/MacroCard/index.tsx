import React from 'react';
import styled from 'styled-components/native';
import { ProgressBar } from '../ProgressBar';
import { Block } from '../Elements';
import { Theme } from '../../common/theme';

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
      <Title>{props.title}</Title>
      <Unit>(g)</Unit>
    </Container>
  );
}

const Container = styled.View`
  display: flex;
  justify-content: center;
  width: 100px;
`

const Eaten = styled.Text<{
  theme: Theme
}>`
  font-family: ${props => props.theme.fontFamily};
  font-size: 22px;
`

const Needed = styled.Text`
  font-size: 13px;
  color: #c7c7c7;
`

const Slash = styled.Text`
  color: #dbdbdb;
  margin: 0 3px;
`

const Title = styled.Text<{
  theme: Theme
}>`
  font-family: ${props => props.theme.fontFamily};
  text-align: center;
  font-size: 13px;
  color: #c7c7c7;
`

const Unit = styled(Title)`
  font-size: 12px;
  margin-top: 1px;
`