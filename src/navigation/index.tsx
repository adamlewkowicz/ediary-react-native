import {
  createStackNavigator,
  createAppContainer,
  createBottomTabNavigator,
  createSwitchNavigator,
} from 'react-navigation';
import {
  Home,
  ProductCreate,
  ProductFind,
  AppLoading,
  ProfileCreate,
  BarcodeScan,
  DiarySummary,
} from '../screens';
import { theme } from '../common/theme';
import { Screen } from '../types';

export function createHomeStack(
  initialRouteName: Screen = 'Home'
) {
  return createStackNavigator({
    Home,
    ProductCreate,
    ProductFind,
    BarcodeScan,
  }, {
    initialRouteName,
    headerMode: 'screen',
    defaultNavigationOptions: {
      headerTitleStyle: {
        fontFamily: theme.fontWeight.regular
      }
    }
  });
}

const HomeStack = createHomeStack();

const MainStack = createBottomTabNavigator({
  Home: HomeStack,
  DiarySummary,
}, {
  initialRouteName: 'Home',
});

const RootNavigator = createSwitchNavigator({
  Main: MainStack,
  ProfileCreate,
  AppLoading
}, { initialRouteName: 'AppLoading' });

export const AppContainer = createAppContainer(RootNavigator);