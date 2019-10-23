import { useNavigation } from 'react-navigation-hooks';
import { useState } from 'react';

export const useNavigationParams = <
  T extends object,
  K extends keyof T = keyof T
>(
  paramNames: readonly K[]
): T => {
  const navigation = useNavigation();

  const getParamsObject = (): T => {
    return paramNames.reduce<T>(
      (normalized, paramName) => ({
        ...normalized,
        [paramName]: navigation.getParam(paramName as string)
      }),
      {} as T
    );
  }

  const [params] = useState<T>(getParamsObject);

  return params;
}