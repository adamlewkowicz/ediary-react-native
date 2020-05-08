import * as React from 'react';
import { AnimatedRegion, Marker } from 'react-native-maps';
import { Platform } from 'react-native';
import styled from 'styled-components/native';
import { Coordinate } from '../../types';
import Geolocation, { GeolocationResponse } from '@react-native-community/geolocation';
import { TextPrimary, MapView, TrainingData } from '../../components';
import { useRunningTraining } from '../../hooks/use-running-training';
import { useLocationPermission } from '../../hooks/use-location-permission';
import { TrainingButtons } from '../../components/molecules/TrainingButtons';

export const RunningScreen = () => {
  const animatedRegion = React.useRef(new AnimatedRegion({
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0,
    longitudeDelta: 0,
  }));
  const markerRef = React.useRef<Marker>(null);
  const training = useRunningTraining();
  const [isLocked, setIsLocked] = React.useState(true);
  const permission = useLocationPermission();

  const handleCoordinateAnimation = (
    newCoordinate: Coordinate,
    coordinate: AnimatedRegion
  ): void => {
    if (Platform.OS === 'android') {
      markerRef.current?.animateMarkerToCoordinate(
        newCoordinate,
        500
      );
    } else {
      coordinate.timing(newCoordinate).start();
    }
  }

  React.useEffect(() => {
    if (permission.isGranted) {
      training.start();
    }

    return () => training.finish();
  }, [permission.isGranted]);

  return (
    <Container>
      <DataContainer>
        <TrainingData
          distance={training.data.distance}
          duration={training.data.duration}
          startTime={training.data.startTime}
        />
        {!permission.isGranted && (
          <TextPrimary>
            Potwierdź uprawnienia do lokalizacji
          </TextPrimary>
        )}
        <TrainingButtons
          isLocked={isLocked}
          onLockToggle={setIsLocked}
          isTrainingPaused={training.data.isPaused}
          onTrainingFinish={training.finish}
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