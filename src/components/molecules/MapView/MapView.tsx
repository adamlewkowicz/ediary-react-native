import React from 'react';
import styled from 'styled-components/native';
import NativeMapView, { Region, Polyline, Marker } from 'react-native-maps';

interface MapViewProps {
  coordinates: any[]
}

export const MapView = (props: MapViewProps) => {
  const [coordinate] = props.coordinates;

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