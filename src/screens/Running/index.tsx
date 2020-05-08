import * as React from 'react';
import { Alert } from 'react-native';
import styled from 'styled-components/native';
import { TextPrimary, MapView, TrainingData } from '../../components';
import { useRunningTraining } from '../../hooks/use-running-training';
import { useLocationPermission } from '../../hooks/use-location-permission';
import { TrainingButtons } from '../../components/molecules/TrainingButtons';
import { useNavigationData } from '../../hooks';
import { APP_ROUTE } from '../../navigation/consts';
import { RunningTrainingScreenNavigationProps } from '../../navigation/TrainingStack';

export const RunningScreen = () => {
  const training = useRunningTraining();
  const locationPermission = useLocationPermission();
  const { navigate } = useNavigationData<RunningTrainingScreenNavigationProps>();

  React.useEffect(() => {
    if (locationPermission.isGranted) {
      training.start();
    }

    // navigate(APP_ROUTE.Countdown, {
    //   countdown: 3,
    //   onCountdownEnd: () => navigate('RunningTraining')
    // });

    return () => training.finish();
  }, [locationPermission.isGranted]);

  const handleTrainingFinish = () => {
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
        {!locationPermission.isGranted && (
          <TextPrimary>
            Potwierdź uprawnienia lokalizacji
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