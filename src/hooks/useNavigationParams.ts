import { useNavigation } from 'react-navigation-hooks';
import { useState } from 'react';

export const useNavigationParams = <
  T extends object,
  K extends keyof T
>(
  paramNames: K[]
) => {
  type ParamEntries = [K, T[K]][];
  type K = keyof T

  const navigation = useNavigation();
  const [params, setParams] = useState(() => {
    const paramEntries = paramNames.map<ParamEntries>(paramName => [
      paramName, navigation.getParam(paramName)
    ]);
    const paramsObject: T = Object.fromEntries(paramEntries);
    return paramsObject;
  });

  function getParams<T extends string[]> (
    paramNames: T,
    paramGetter: (paramName: T[number]) => string
  ) {
    const paramEntries = paramNames.map<ParamEntries>(paramName => [
      paramName, navigation.getParam(paramName)
    ]);
    const paramsObject: T = Object.fromEntries(paramEntries);
    return paramsObject;
  }

  getParams(
    ['aa'],
    navigation.getParam
  );

  



  return params;
}

interface Params {
  ab: true 
}
useNavigationParams<Params>(['abc']);