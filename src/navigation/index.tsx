import {
  createStackNavigator,
  createAppContainer,
  createBottomTabNavigator,
  createSwitchNavigator,
} from 'react-navigation';
import { Home } from '../pages/Home';
import { ProductCreate } from '../pages/ProductCreate';
import { ProductFind } from '../pages/ProductFind';
import { AppLoading } from '../pages/AppLoading';
import { ProfileCreate } from '../pages/ProfileCreate';
import { themeProps } from '../common/theme';
import { IS_DEV } from '../common/consts';
import { BarcodeScan } from '../pages/BarcodeScan';

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