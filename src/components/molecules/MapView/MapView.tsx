import React from 'react';
import styled from 'styled-components/native';
import NativeMapView, { Region, Polyline, Marker, AnimatedRegion } from 'react-native-maps';
import { Platform } from 'react-native';
import { Coordinate } from '../../../types';

interface MapViewProps {
  coordinates: any[]
}

export const MapView = (props: MapViewProps) => {
  const [coordinate] = props.coordinates;
  const animatedRegion = React.useRef(new AnimatedRegion({
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0,
    longitudeDelta: 0,
  }));
  const markerRef = React.useRef<Marker>(null);

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

  const mapRegion: Region = {
    latitude: coordinate?.latitude ?? 0,
    longitude: coordinate?.longitude ?? 0,
    latitudeDelta: 0,
    longitudeDelta: 0,
  };

  return (
    <StyledMapView
      showsUserLocation
      followsUserLocation
      loadingEnabled
      region={mapRegion}
    >
      <Polyline
        coordinates={props.coordinates}
        strokeWidth={5}
      />
    </StyledMapView>
  );
}

const StyledMapView = styled(NativeMapView)`
  flex: 1;
`