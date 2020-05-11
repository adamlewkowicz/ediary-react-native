import React from 'react';
import styled from 'styled-components/native';
import { H1, TextPrimary } from '../../atoms';
import { Detail } from './Detail';
import { BlinkingView } from '../BlinkingView';

interface TrainingDetailsProps {
  distance: number
  duration: number
  velocity: number
  isPaused: boolean
  startTime: string | null
}

export const TrainingDetails = (props: TrainingDetailsProps) => (
  <Container isBlinking={props.isPaused}>
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
        value={`${props.velocity.toFixed(0)} km/h`}
      />
    </Details>
  </Container>
);

const Container = styled(BlinkingView)`
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