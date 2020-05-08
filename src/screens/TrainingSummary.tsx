import React from 'react';
import styled from 'styled-components/native';
import { MapView, ButtonPrimary } from '../components';
import { useSelector } from 'react-redux';
import { Selectors } from '../store';
import { Detail } from '../components/molecules/TrainingData/Detail';

export const TrainingSummaryScreen = () => {
  const training = useSelector(Selectors.getRunningTraining);

  return (
    <Container>
      <MapView coordinates={training.routeCoordinates} />
      <Details>
        <Detail title="Czas" value={training.duration} />
        <Detail title="Średnia prędkość" value="14.5 km/h" />
        <Detail title="Spalone kalorie" value={489} />
      </Details>
      <ButtonPrimary>
        Koniec
      </ButtonPrimary>
    </Container>
  );
}

const Container = styled.View`
`

const Details = styled.View`
`