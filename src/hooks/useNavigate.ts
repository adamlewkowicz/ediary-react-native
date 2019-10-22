import { useNavigation } from 'react-navigation-hooks';
import { ScreenParamsMap } from '../navigation/params';

export function useNavigate() {
  const navigation = useNavigation();

  const handleNavigate = <K extends keyof ScreenParamsMap>(
    screenName: K,
    screenParams?: ScreenParamsMap[K],
  ): boolean => {
    return navigation.navigate(screenName, screenParams);
  }
  
  return handleNavigate;
}