import {
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import { BaseScreenProps } from '../types';

export const useNavigationData = <T extends BaseScreenProps>() => {
  const navigation = useNavigation<T['navigation']>();  
  const route = useRoute<T['route']>();  

  return { navigation, route };
}

