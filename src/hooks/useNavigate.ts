import { useNavigation } from 'react-navigation-hooks';
import { Screen } from '../types';
import { ScreenParams } from '../navigation/params';

export function useNavigate(
  screenName: Screen,
  screenParams: ScreenParams<Screen>
) {
  const navigation = useNavigation();
  
  function handleNavigation() {
    navigation.navigate(screenName, screenParams);
  }
  
  return handleNavigation; 
}