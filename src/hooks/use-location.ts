import { useNativeState } from './use-native-state';
import { useRef, useEffect } from 'react';
import Geolocation, { GeolocationResponse } from '@react-native-community/geolocation';

interface Options {
  timeout: number
}

interface State {
  latitude: number
  longitude: number
}

export const useLocation = (options: Options) => {
  const [state, setState] = useNativeState<State>({
    latitude: 0,
    longitude: 0,
  });
  const watchId = useRef(0);

  useEffect(() => {
    const handlePositionUpdate = (position: GeolocationResponse) => {
      const { latitude, longitude } = position.coords;
      const newCoordinate = { latitude, longitude };

      setState({ ...newCoordinate });
    }

    Geolocation.getCurrentPosition(handlePositionUpdate);

    watchId.current = Geolocation.watchPosition(handlePositionUpdate,
    error => console.error(error),
    {
      enableHighAccuracy: true,
      timeout: 1000,
      maximumAge: 1000,
    }
  );

    return () => {
      Geolocation.clearWatch(watchId.current);
    }
  }, []);

  return state;
}