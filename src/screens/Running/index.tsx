import * as React from 'react';
import { Alert } from 'react-native';
import styled from 'styled-components/native';
import { TextPrimary, MapView, TrainingData, ButtonPrimary } from '../../components';
import { useRunningTraining } from '../../hooks/use-running-training';
import { useLocationPermission } from '../../hooks/use-location-permission';
import { TrainingActionButtons } from '../../components/molecules/TrainingActionButtons';
import { useNavigationData } from '../../hooks';
import { APP_ROUTE } from '../../navigation/consts';
import { RunningTrainingScreenNavigationProps } from '../../navigation/TrainingStack';

export const RunningScreen = () => {
  const training = useRunningTraining();
  const locationPermission = useLocationPermission();
  const { navigate } = useNavigationData<RunningTrainingScreenNavigationProps>();
  const [isMapShown, setIsMapShown] = React.useState(false);

  const handleMapShownToggle = () => setIsMapShown(status => !status);

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

  const handleFinish = () => {
    training.finish();
    navigate('TrainingSummary');
  }

  const handleTrainingFinish = () => {
    Alert.alert(
      'Zakończ trening',
      'Czy chcesz zakończyć trening?',
      [
        {
          text: 'Anuluj',
          style: 'cancel',
        },
        {
          text: 'Zakończ',
          onPress: handleFinish
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
        <TrainingActionButtons
          isPaused={training.data.isPaused}
          onFinish={handleTrainingFinish}
          onPause={training.pause}
          onUnpause={training.unpause}
        />
        <TextPrimary>Szer: {training.data.prevCoordinate.latitude}</TextPrimary>
        <TextPrimary>Wys: {training.data.prevCoordinate.longitude}</TextPrimary>
      </DataContainer>
      <ButtonPrimary onPress={handleMapShownToggle}>
        {`${isMapShown ? 'Schowaj' : 'Pokaż'} mapę` }
      </ButtonPrimary>
      {isMapShown && (
        <MapView coordinates={training.data.coordinates} />
      )}
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