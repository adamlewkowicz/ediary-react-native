import { useState, useEffect } from 'react'
import { requestLocationPermission } from '../utils';

export const useLocationPermission = () => {
  const [isGranted, setIsGranted] = useState<boolean | null>(null);

  const request = async () => {
    const permissionGranted = await requestLocationPermission();
    setIsGranted(permissionGranted);
  }

  useEffect(() => {
    request();
  }, []);

  return { isGranted, request };
}