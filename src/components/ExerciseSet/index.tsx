import React from 'react';
import styled from 'styled-components/native';
import { ExerciseSetState } from '../../store/reducers/gymTraining/types';

const getTime = (duration: number) => {
  const date = new Date(null);
  date.setSeconds(duration);
  const timeString = date.toISOString().substr(14, 5);
  return timeString;
}

interface ExerciseSetProps {
  data: ExerciseSetState
  index: number
}

export const ExerciseSet = (props: ExerciseSetProps) => {
  const isActive = props.data.state === 'active';
  const isFinished = props.data.state === 'finished';
  const duration = getTime(props.data.duration);

  return (
    <Container isActive={isActive}>
      {/* <SetIndex>{props.index + 1}</SetIndex> */}
      <StatusIndicator
        isFinished={isFinished}
        isRest={props.data.isRest}
      />
      <InfoContainer>
        <LoadWeight isActive={isActive}>
          {props.data.loadWeight} kg
        </LoadWeight>
        <Repeats isActive={isActive}>
          x {props.data.repeats}
        </Repeats>
      </InfoContainer>
      <Duration isActive={isActive}>
        {duration}
      </Duration>
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
  justify-content: space-between;
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
      return props.theme.color.green10;
    }
    if (props.isRest) {
      return props.theme.color.blue10;
    }
    return props.theme.color.gray10;    
  }};
`

const InfoContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  min-width: 80px;
`

const BaseText = styled.Text<{
  isActive: boolean
}>`
  font-family: ${props => props.theme.fontWeight.regular};
  color: ${props => props.isActive ? 'white' : 'black'};
`

const LoadWeight = styled(BaseText)`
  font-size: ${props => props.theme.fontSize.large};
`

const Repeats = LoadWeight;

const Duration = styled(BaseText)`
  text-align: right;
  min-width: 40px;
  color: ${props => props.isActive ? 'white' : props.theme.color.gray20};
`