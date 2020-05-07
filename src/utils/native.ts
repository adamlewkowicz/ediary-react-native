import { PermissionsAndroid } from 'react-native';

export const requestLocationPermission = async (): Promise<boolean> => {
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