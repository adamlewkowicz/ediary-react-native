import * as React from 'react';
import { AnimatedRegion, Region, Polyline, Marker } from 'react-native-maps';
import { Platform, View } from 'react-native';
import styled from 'styled-components/native';
import { Coordinate } from '../../types';
import Geolocation, { GeolocationResponse } from '@react-native-community/geolocation';
import { HoldableButton } from '../../components/HoldableButton';
import { TextPrimary, ButtonPrimary, MapView } from '../../components';
import { GeoLocation as CustomGeoLocation } from '../../services/GeoLocation';
import { useRunningTraining } from '../../hooks/use-running-training';
import { useLocationPermission } from '../../hooks/use-location-permission';

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

  const mapRegion: Region = {
    latitude: training.data.coordinate.latitude,
    longitude: training.data.coordinate.longitude,
    latitudeDelta: 0,
    longitudeDelta: 0,
  };

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
        <ButtonPrimary>
          Zacznij trening
        </ButtonPrimary>
        <TextPrimary>
          {training.data.distance} km
        </TextPrimary>
        <View>
          <TextPrimary>
            {String(Math.floor(training.data.duration))} czas
          </TextPrimary>
        </View>
        <TextPrimary>
          {training.data.velocity.toFixed(2)} km/h
        </TextPrimary>

        {!permission.isGranted && (
          <TextPrimary>
            Potwierdź uprawnienia do lokalizacji
          </TextPrimary>
        )}
        {isLocked ? (
          <HoldableButton
            onPressExceeded={() => setIsLocked(false)}
          />
        ): (
          <>
            <ButtonPrimary
              onPress={() => training.pauseToggle()}
            >
              {training.data.isPaused ? 'Kontynuuj' : 'Pauza'}
            </ButtonPrimary>
            <ButtonPrimary
              onPress={() => training.finish()}
            >
              Zakończ
            </ButtonPrimary>
            <ButtonPrimary
              onPress={() => setIsLocked(true)}
            >
              Zablokuj
            </ButtonPrimary>
          </>
        )}
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