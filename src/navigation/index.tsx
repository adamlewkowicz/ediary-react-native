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

export const HomeStack = createStackNavigator({
  Home,
  ProductCreate,
  ProductFind,
  BarcodeScan,
}, {
  headerMode: 'screen',
  defaultNavigationOptions: {
    headerTitleStyle: {
      fontFamily: themeProps.fontFamily
    }
  }
});

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