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
} from '../screens';
import { themeProps } from '../common/theme';
import { IS_DEV } from '../common/consts';
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
        fontFamily: themeProps.fontFamily
      }
    }
  });
}

const HomeStack = createHomeStack();

const MainStack = createBottomTabNavigator({
  // ...IS_DEV && { StoryBook: require('../../storybook').StorybookUIRoot },
  Home: HomeStack,
}, {
  initialRouteName: 'Home',
  // initialRouteName: IS_DEV ? 'StoryBook' : 'Home',
});

const RootNavigator = createSwitchNavigator({
  Main: MainStack,
  ProfileCreate,
  AppLoading
}, { initialRouteName: 'AppLoading' });

export const AppContainer = createAppContainer(RootNavigator);