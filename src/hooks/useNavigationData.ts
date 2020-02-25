import {
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import { BaseScreenProps } from '../types';

export const useNavigationData = <
  T extends BaseScreenProps,
  Navigation extends T['navigation'] = T['navigation'],
  Route extends T['route'] = T['route']
>() => {
  const navigation = useNavigation<Navigation>();  
  const route = useRoute<Route>();
  const navigate: Navigation['navigate'] = navigation.navigate;
  const params: Route['params'] = route.params;

  return {
    navigation,
    route,
    navigate,
    params,
  };
}