import React, { useEffect } from 'react';
import styled from 'styled-components/native';
import { H1, TextPrimary } from '../../atoms';
import { Detail } from './Detail';
import { Animated } from 'react-native';
import { useAnimatedValue } from '../../../hooks/use-animated-value';

interface TrainingDataProps {
  distance: number
  duration: number
  isPaused: boolean
  startTime: string | null
}

export const TrainingData = (props: TrainingDataProps) => {
  const animatedValue = useAnimatedValue(0);
  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.5],
  });

  useEffect(() => {
    if (props.isPaused) {
      spring();
    }
  }, [props.isPaused]);

  const spring = () => {
    animatedValue.setValue(0);

    Animated.timing(
      animatedValue,
      {
        toValue: 1,
        duration: 1000,
      }
    ).start(() => {
      if (props.isPaused) {
        spring();
      }
    });
  }

  return (
    <Animated.View style={{ opacity }}>
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
    </Animated.View>
  );
}

const Container = styled.View`
`

const Details = styled.View`
  flex-direction: row;
  justify-content: space-around;
`

const Distance = styled(H1)`
  font-size: 48px;
`
