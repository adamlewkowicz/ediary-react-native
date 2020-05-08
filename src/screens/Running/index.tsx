import * as React from 'react';
import { Alert } from 'react-native';
import styled from 'styled-components/native';
import { TextPrimary, MapView, TrainingData } from '../../components';
import { useRunningTraining } from '../../hooks/use-running-training';
import { useLocationPermission } from '../../hooks/use-location-permission';
import { TrainingButtons } from '../../components/molecules/TrainingButtons';

export const RunningScreen = () => {
  const training = useRunningTraining();
  const permission = useLocationPermission();

  React.useEffect(() => {
    if (permission.isGranted) {
      training.start();
    }

    return () => training.finish();
  }, [permission.isGranted]);

  const handleTrainingFinish = () => {
    training.pause();

    Alert.alert(
      'Zakończyć sesję?',
      '',
      [
        {
          text: 'Anuluj',
          style: 'cancel',
        },
        {
          text: 'Zakończ',
          onPress: training.finish
        }
      ]
    );
  }

  return (
    <Container>
      <DataContainer>
        <TrainingData
          distance={training.data.distance}
          duration={training.data.duration}
          startTime={training.data.startTime}
          isPaused={training.data.isPaused}
        />
        {!permission.isGranted && (
          <TextPrimary>
            Potwierdź uprawnienia do lokalizacji
          </TextPrimary>
        )}
        <TrainingButtons
          isTrainingPaused={training.data.isPaused}
          onTrainingFinish={handleTrainingFinish}
          onTrainingPause={training.pauseToggle}
        />
        <TextPrimary>Szer: {training.data.coordinate.latitude}</TextPrimary>
        <TextPrimary>Wys: {training.data.coordinate.longitude}</TextPrimary>
      </DataContainer>
      <MapView coordinates={training.data.routeCoordinates} />
    </Container>
  );
}

const Container = styled.View`
  flex: 1;
`

const DataContainer = styled.View`
  padding: 10px 0;
  align-items: center;
  justify-content: space-around;
`