import * as React from 'react';
import MapView, { AnimatedRegion, Region, Polyline, Marker } from 'react-native-maps';
import { Platform, PermissionsAndroid } from 'react-native';
import haversine from 'haversine';
import styled from 'styled-components/native';
import { Coordinate } from '../../types';
import { connect, DispatchProp } from 'react-redux';
import { Actions, StoreState } from '../../store';
import Geolocation, { GeolocationResponse } from '@react-native-community/geolocation';
import { LabeledValue } from '../../components/LabeledValue';
import { Block } from '../../components/Elements';
import { formatDuration } from '../../common/utils';
import { HoldableButton } from '../../components/HoldableButton';

interface RunningScreenProps extends DispatchProp, MapStateToProps {}

class RunningScreen extends React.Component<RunningScreenProps, RunningScreenState> {

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

  async requestPermissionStatus(): Promise<boolean> {
    const permissionStatus = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, 
      {
        title: 'Zatwierdź uprawnienia',
        message: 'Funkcja bieganie wymaga uprawnień lokalizacji.',
        buttonPositive: 'OK',
        buttonNegative: 'Anuluj',
      }
    );
    if (permissionStatus === 'granted') {
      return true;
    }
    return false;
  }

  getCurrentPosition(): Promise<GeolocationResponse> {
    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
        resolve,
        reject
      );
    });
  }

  async componentDidMount() {
    const permissionStatus = await this.requestPermissionStatus()
    if (!permissionStatus) {
      return;
    }

    const currentPosition = await this.getCurrentPosition();
    const { latitude, longitude } = currentPosition.coords;

    const newCoordinate = { latitude, longitude };

    this.setState({
      latitude, longitude,
      routeCoordinates: [newCoordinate, newCoordinate]
    });

    this.props.dispatch(
      Actions.runningTrainingStart() as any
    );

    this.watchID = Geolocation.watchPosition(
      position => {
        const { coordinate, routeCoordinates, distanceTravelled } = this.state;
        const { latitude, longitude } = position.coords;
        const newCoordinate = { latitude, longitude };

        this.props.dispatch(Actions.runningTrainingPositionUpdated(position));
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
      Geolocation.clearWatch(this.watchID);
      this.props.dispatch(Actions.runningTrainingFinish() as any);
    }
  }

  render() {
    return (
      <Container>
        <DataContainer>
          <LabeledValue
            value={this.props.runningTraining.distance.toString()}
            label="km"
          />
          <Block marginVertical={10}>
            <LabeledValue
              value={formatDuration(this.props.runningTraining.duration)}
              label="Czas"
            />
          </Block>
          <HoldableButton
            onHoldEnd={() => {}}
          />
        </DataContainer>
        <StyledMapView
          showsUserLocation
          followsUserLocation
          loadingEnabled
          region={this.getMapRegion()}
        >
          <Polyline
            coordinates={this.state.routeCoordinates}
            strokeWidth={5}
          />
        </StyledMapView>
      </Container>
    );
  }

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

const mapStateToProps = (store: StoreState) => ({
  runningTraining: store.runningTraining
});

const RunningScreenConnected = connect(mapStateToProps)(RunningScreen);
export { RunningScreenConnected as RunningScreen };

interface RunningScreenState {
  latitude: number
  longitude: number
  routeCoordinates: Coordinate[]
  distanceTravelled: number
  prevLatLng: Coordinate
  coordinate: AnimatedRegion
}

type MapStateToProps = ReturnType<typeof mapStateToProps>;