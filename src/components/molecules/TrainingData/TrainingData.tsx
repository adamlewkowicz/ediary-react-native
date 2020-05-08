import React from 'react';
import styled from 'styled-components/native';
import { H1, TextPrimary } from '../../atoms';
import { Detail } from './Detail';

interface TrainingDataProps {
  distance: number
  duration: number
  startTime: string | null
}

export const TrainingData = (props: TrainingDataProps) => {
  return (
    <Container>
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

const Container = styled.View`
`

const Details = styled.View`
  flex-direction: row;
  justify-content: space-around;
`

const Distance = styled(H1)`
  font-size: 48px;
`
