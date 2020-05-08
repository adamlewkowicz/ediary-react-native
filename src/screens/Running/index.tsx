import * as React from 'react';
import MapView, { AnimatedRegion, Region, Polyline, Marker } from 'react-native-maps';
import { Platform, View } from 'react-native';
import styled from 'styled-components/native';
import { Coordinate } from '../../types';
import Geolocation, { GeolocationResponse } from '@react-native-community/geolocation';
import { HoldableButton } from '../../components/HoldableButton';
import { requestLocationPermission } from '../../utils';
import { TextPrimary, ButtonPrimary } from '../../components';
import { GeoLocation as CustomGeoLocation } from '../../services/GeoLocation';
import { useRunningTraining } from '../../hooks/use-running-training';

export const RunningScreen = () => {
  const animatedRegion = React.useRef(new AnimatedRegion({
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0,
    longitudeDelta: 0,
  }));
  const markerRef = React.useRef<Marker>(null);
  const training = useRunningTraining();

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
    const bootstrap = async () => {
      const permissionGranted = await requestLocationPermission();

      if (!permissionGranted) {
        return;
      }

      training.start();
    }

    bootstrap();

    return () => training.finish();
  }, []);

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
        <HoldableButton
          onPressExceeded={() => training.pauseToggle()}
        />
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
        <TextPrimary>Szer: {training.data.coordinate.latitude}</TextPrimary>
        <TextPrimary>Wys: {training.data.coordinate.longitude}</TextPrimary>
      </DataContainer>
      <StyledMapView
        showsUserLocation
        followsUserLocation
        loadingEnabled
        region={mapRegion}
      >
        <Polyline
          coordinates={training.data.routeCoordinates}
          strokeWidth={5}
        />
      </StyledMapView>
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

const StyledMapView = styled(MapView)`
  flex: 1;
`