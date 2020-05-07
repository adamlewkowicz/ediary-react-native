import * as React from 'react';
import MapView, { AnimatedRegion, Region, Polyline, Marker,  } from 'react-native-maps';
import { Platform, View } from 'react-native';
import styled from 'styled-components/native';
import { Coordinate } from '../../types';
import { useDispatch, useSelector } from 'react-redux';
import { Actions, Selectors } from '../../store';
import Geolocation, { GeolocationResponse } from '@react-native-community/geolocation';
import { HoldableButton } from '../../components/HoldableButton';
import { useNativeState } from '../../hooks';
import { requestLocationPermission } from '../../utils';
import { TextPrimary } from '../../components';

interface RunningScreenState {
  latitude: number
  longitude: number
  routeCoordinates: Coordinate[]
  distanceTravelled: number
  prevLatLng: Coordinate
  coordinate: AnimatedRegion
}

export const RunningScreen = () => {
  const [state, setState] = useNativeState<RunningScreenState>({
    latitude: 0,
    longitude: 0,
    routeCoordinates: [],
    distanceTravelled: 0,
    prevLatLng: { latitude: 0, longitude: 0 },
    coordinate: new AnimatedRegion({
     latitude: 0,
     longitude: 0,
     latitudeDelta: 0,
     longitudeDelta: 0,
    }),
  });
  const watchId = React.useRef<number | null>(null);
  const markerRef = React.useRef<Marker>(null);
  const dispatch = useDispatch();
  const runningTraining = useSelector(Selectors.getRunningTraining);

  const getMapRegion = (): Region => ({
    latitude: state.latitude,
    longitude: state.longitude,
    latitudeDelta: 0,
    longitudeDelta: 0,
  });

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

  const getCurrentPosition = (): Promise<GeolocationResponse> => {
    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
        resolve,
        reject
      );
    });
  }

  React.useEffect(() => {
    const bootstrap = async () => {
      const permissionGranted = await requestLocationPermission();

      if (!permissionGranted) {
        return;
      }
  
      const currentPosition = await getCurrentPosition();
      const { latitude, longitude } = currentPosition.coords;
  
      const newCoordinate = { latitude, longitude };
  
      setState({
        latitude,
        longitude,
        routeCoordinates: [newCoordinate, newCoordinate]
      });
  
      dispatch(Actions.runningTrainingStart());
    }

    bootstrap();

    return () => {
      Geolocation.clearWatch(watchId.current as number);
      dispatch(Actions.runningTrainingFinish());
    }
  }, [dispatch]);

  return (
    <Container>
      <DataContainer>
        <TextPrimary>
          {runningTraining.distance.toFixed(1)} km
        </TextPrimary>
        <View>
          <TextPrimary>
            {String(Math.floor(runningTraining.duration))} czas
          </TextPrimary>
        </View>
        <TextPrimary>
          {runningTraining.velocity.toFixed(2)} km/h
        </TextPrimary> 
        <HoldableButton
          onHoldEnd={() => {}}
        />
      </DataContainer>
      <StyledMapView
        showsUserLocation
        followsUserLocation
        loadingEnabled
        region={getMapRegion()}
      >
        <Polyline
          coordinates={runningTraining.routeCoordinates}
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