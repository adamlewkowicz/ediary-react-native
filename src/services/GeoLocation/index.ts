import NativeGeolocation, { GeolocationResponse } from '@react-native-community/geolocation';

export class GeoLocation {

  static subscribeToLocation(
    callback: (location: Location) => void
  ) {
    const handlePositionUpdate = (position: GeolocationResponse) => {
      const { longitude, latitude } = position.coords;
      const location: Location = { longitude, latitude };
      callback(location);
    }

    const watchId = NativeGeolocation.watchPosition(handlePositionUpdate);

    return (): void => NativeGeolocation.clearWatch(watchId);
  }

  static getCurrentPosition = (): Promise<GeolocationResponse> => {
    return new Promise((resolve, reject) => {
      NativeGeolocation.getCurrentPosition(
        resolve,
        reject
      );
    });
  }

}

interface Location {
  latitude: number
  longitude: number
}