import { useNavigation } from 'react-navigation-hooks';

export const useNavigationParams = <T extends object>(): T => {
  const navigation = useNavigation();
  return navigation.state.params as T;
}