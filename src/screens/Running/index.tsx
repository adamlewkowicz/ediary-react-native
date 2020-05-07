import * as React from 'react';
import MapView, { AnimatedRegion, Region, Polyline, Marker } from 'react-native-maps';
import { Platform, PermissionsAndroid } from 'react-native';
import styled from 'styled-components/native';
import { Coordinate } from '../../types';
import { useDispatch, useSelector } from 'react-redux';
import { Actions, Selectors } from '../../store';
import Geolocation, { GeolocationResponse } from '@react-native-community/geolocation';
import { LabeledValue } from '../../components/LabeledValue';
import { Block } from '../../components/Elements';
import { formatDuration } from '../../common/utils';
import { HoldableButton } from '../../components/HoldableButton';
import { useNativeState } from '../../hooks';

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

  const requestPermissionStatus = async (): Promise<boolean> => {
    const permissionStatus = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, 
      {
        title: 'Uprawnienia lokalizacji',
        message: 'Potrzebuję uprawnień lokalizacji aby mierzyć dystans.',
        buttonPositive: 'OK',
        buttonNegative: 'Anuluj',
      }
    );
    if (permissionStatus === 'granted') {
      return true;
    }
    return false;
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
      const permissionStatus = await requestPermissionStatus();

      if (!permissionStatus) {
        return;
      }
  
      const currentPosition = await getCurrentPosition();
      const { latitude, longitude } = currentPosition.coords;
  
      const newCoordinate = { latitude, longitude };
  
      setState({
        latitude, longitude,
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
        <LabeledValue
          value={runningTraining.distance.toFixed(1)}
          label="km"
        />
        <Block marginVertical={10} space="space-between">
          <LabeledValue
            accessibilityLabel="Czas trwania treningu"
            value={formatDuration(runningTraining.duration)}
            label="Czas"
          />
        </Block>
        <LabeledValue
          value={runningTraining.velocity.toFixed(2)}
          label="km/h"
        />
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