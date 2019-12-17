import React from 'react';
import styled from 'styled-components/native';
import { ExerciseSetState } from '../../store/reducers/gymTraining/types';

interface ExerciseSetProps {
  data: ExerciseSetState
  index: number
}

export const ExerciseSet = (props: ExerciseSetProps) => {
  const isActive = props.data.state === 'active';
  return (
    <Container isActive={isActive}>
      {/* <SetIndex>{props.index + 1}</SetIndex> */}
      <StatusIndicator
        isFinished={props.data.state === 'finished'}
        isRest={props.data.isRest}
      />
      <LoadWeight isActive={isActive}>
        {props.data.loadWeight} kg
      </LoadWeight>
      <Repeats isActive={isActive}>
        x {props.data.repeats}
      </Repeats>
    </Container>
  );
}

const Container = styled.View<{
  isActive: boolean
}>`
  border-radius: 30px;
  border: ${props => {
    const color = props.theme.color[props.isActive ? 'focus' : 'gray10'];
    return `solid 1px ${color}`;
  }};
  flex-direction: row;
  padding: 15px;
  align-items: center;
  justify-content: space-around;
  background-color: ${props => props.isActive ? props.theme.color.focus : 'white'};
`

const SetIndex = styled.Text``

const StatusIndicator = styled.View<{
  isFinished: boolean
  isRest: boolean
}>`
  border-radius: 24px;
  height: 12px;
  width: 12px;
  background-color: ${props => {
    if (props.isFinished) {
      return props.theme.color.green10
    }
    if (props.isRest) {
      return props.theme.color.blue10;
    }
    return props.theme.color.gray10;    
  }};
`

const LoadWeight = styled.Text<{
  isActive: boolean
}>`
  font-family: ${props => props.theme.fontWeight.regular};
  font-size: ${props => props.theme.fontSize.large};
  color: ${props => props.isActive ? 'white' : 'black'};
`

const Repeats = styled(LoadWeight)``

