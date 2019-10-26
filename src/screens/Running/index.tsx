import * as React from 'react';
import MapView, { AnimatedRegion, Region, Polyline, Marker } from 'react-native-maps';
import { Platform } from 'react-native';
import haversine from 'haversine';
import styled from 'styled-components/native';
import { Coordinate } from '../../types';

export class RunningScreen extends React.Component<{}, RunningScreenState> {

  watchID?: number;
  markerRef = React.createRef<Marker>();

  state: RunningScreenState = {
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
  }

  getMapRegion = (): Region => ({
    latitude: this.state.latitude,
    longitude: this.state.longitude,
    latitudeDelta: 0,
    longitudeDelta: 0,
  });

  calcDistance(newLatLng: Coordinate): number {
    const { prevLatLng } = this.state;
    return haversine(prevLatLng, newLatLng) || 0;
  }

  handleCoordinateAnimation(
    newCoordinate: Coordinate,
    coordinate: AnimatedRegion
  ) {
    if (Platform.OS === 'android') {
      this.markerRef.current?.animateMarkerToCoordinate(
        newCoordinate,
        500
      );
    } else {
      coordinate.timing(newCoordinate).start();
    }
  }

  componentDidMount() {
    this.watchID = navigator.geolocation.watchPosition(
      position => {
        const { coordinate, routeCoordinates, distanceTravelled } = this.state;
        const { latitude, longitude } = position.coords;
        const newCoordinate = { latitude, longitude };

        this.handleCoordinateAnimation(newCoordinate, coordinate);

        this.setState({
          latitude,
          longitude,
          routeCoordinates: [...routeCoordinates, newCoordinate],
          distanceTravelled: distanceTravelled + this.calcDistance(newCoordinate),
          prevLatLng: newCoordinate
        });
      },
      error => console.log(error),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
  }

  componentWillUnmount() {
    if (this.watchID) {
      navigator.geolocation.clearWatch(this.watchID);
    }
  }

  render() {
    return (
      <Container>
        <MapView
          showsUserLocation
          followsUserLocation
          loadingEnabled
          region={this.getMapRegion()}
        >
          <Polyline
            coordinates={this.state.routeCoordinates}
            strokeWidth={5}
          />
          <Marker
            coordinate={this.state.coordinate}
            ref={this.markerRef}
          />
        </MapView>
      </Container>
    );
  }

}

const Container = styled.View``

interface RunningScreenState {
  latitude: number
  longitude: number
  routeCoordinates: Coordinate[]
  distanceTravelled: number
  prevLatLng: Coordinate
  coordinate: AnimatedRegion
}