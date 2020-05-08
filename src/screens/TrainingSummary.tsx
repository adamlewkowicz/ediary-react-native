import React from 'react';
import styled from 'styled-components/native';
import { MapView, ButtonPrimary } from '../components';
import { useSelector } from 'react-redux';
import { Selectors } from '../store';
import { Detail } from '../components/molecules/TrainingData/Detail';
import { useNavigationData } from '../hooks';
import { TrainingSummaryScreenNavigationProps } from '../navigation/TrainingStack';

export const TrainingSummaryScreen = () => {
  const { navigate } = useNavigationData<TrainingSummaryScreenNavigationProps>();
  const training = useSelector(Selectors.getRunningTraining);

  const handleExit = () => navigate('RunningTraining');

  return (
    <Container>
      <MapView coordinates={training.coordinates} />
      <Details>
        <Detail title="Czas" value={training.duration} />
        <Detail title="Średnia prędkość" value="14.5 km/h" />
        <Detail title="Spalone kalorie" value={489} />
      </Details>
      <ButtonPrimary onPress={handleExit}>
        Koniec
      </ButtonPrimary>
    </Container>
  );
}

const Container = styled.View`
  flex: 1;
`

const Details = styled.View`
  flex-direction: row;
  justify-content: space-around;
  padding: ${props => props.theme.spacing.tiny};
  width: 100%;
`