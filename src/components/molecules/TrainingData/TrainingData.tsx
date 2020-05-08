import React from 'react';
import styled from 'styled-components/native';
import { H1, TextPrimary } from '../../atoms';
import { Detail } from './Detail';
import { Animated } from 'react-native';
import { useAnimatedLoop } from '../../../hooks/use-animated-loop';

interface TrainingDataProps {
  distance: number
  duration: number
  isPaused: boolean
  startTime: string | null
}

export const TrainingData = (props: TrainingDataProps) => {
  const animtedValueLoop = useAnimatedLoop({ isRunning: props.isPaused });
  const opacity = animtedValueLoop.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.2],
  });

  return (
    <Container style={{ opacity }}>
      <Distance>
        {props.distance.toFixed(2)} 
        <TextPrimary>km</TextPrimary>
      </Distance>
      <Details>
        <Detail
          title="Czas"
          value={props.duration}
          // value={dayjs(dayjs.duration(props.duration, 'seconds').toISOString()).format('hh:mm:ss')}
        />
        <Detail
          title="Prędkość"
          value={`${0} km/h`}
        />
      </Details>
    </Container>
  );
}

const Container = styled(Animated.View)`
  align-items: center;
  margin-bottom: ${props => props.theme.spacing.base};
`

const Details = styled.View`
  flex-direction: row;
  justify-content: space-evenly;
  flex-direction: row;
  width: 100%;
`

const Distance = styled(H1)`
  font-size: 48px;
`