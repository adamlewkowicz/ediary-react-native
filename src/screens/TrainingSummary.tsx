import React from 'react';
import styled from 'styled-components/native';
import { MapView, ButtonPrimary } from '../components';
import { Detail } from '../components/molecules/TrainingDetails/Detail';
import { useNavigationData } from '../hooks';
import { TrainingSummaryScreenNavigationProps } from '../navigation/TrainingStack';
import { useRunningTraining } from '../hooks/use-running-training';

export const TrainingSummaryScreen = () => {
  const { navigate } = useNavigationData<TrainingSummaryScreenNavigationProps>();
  const training = useRunningTraining();

  const handleExit = async () => {
    await training.save();
    navigate('RunningTraining');
  }

  return (
    <Container>
      <MapView coordinates={training.data.coordinates} />
      <Details>
        <Detail title="Czas" value={training.data.duration} />
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