import { useNavigation } from 'react-navigation-hooks';
import { useState } from 'react';

export const useNavigationParams = <
  T extends object,
  K extends keyof T = keyof T
>(
  paramNames: K[]
): T => {
  type ParamEntries = [K, T[K]][];

  const navigation = useNavigation();

  const [params] = useState<T>(() => {
    const paramEntries = paramNames.map<ParamEntries>(paramName => [
      paramName, navigation.getParam(paramName as string)
    ]);
    const paramsObject: T = Object.fromEntries(paramEntries);
    return paramsObject;
  });

  return params;
}