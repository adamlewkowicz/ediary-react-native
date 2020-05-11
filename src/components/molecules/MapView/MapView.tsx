import React, { useState } from 'react';
import styled from 'styled-components/native';
import NativeMapView, { Region, Polyline, Marker, AnimatedRegion } from 'react-native-maps';
import { Platform } from 'react-native';
import { Coordinate } from '../../../types';
import { createDebouncedFunc } from '../../../utils';

interface MapViewProps {
  coordinates: Coordinate[]
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
  const [userRegion, setUserRegion] = useState<Region | null>(null);

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

  const genericRegion = userRegion ?? mapRegion;

  console.log({ userRegion, mapRegion })

  const handleRegionChange = createDebouncedFunc(setUserRegion, 200);



  return (
    <StyledMapView
      region={mapRegion}
      // onRegionChangeComplete={setUserRegion}
      onRegionChangeComplete={setUserRegion}
    >
      {props.coordinates.map(coord => (
        <Marker
          key={coord.latitude}
          coordinate={coord}
          title="Title"
          description="Desc"
        /> 
      ))}
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