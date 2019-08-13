import { createStackNavigator, createAppContainer, createBottomTabNavigator, createSwitchNavigator } from 'react-navigation';
import { Home } from '../pages/Home';
import { ProductCreate } from '../pages/ProductCreate';
import { ProductFinder } from '../pages/ProductFinder';
import { AppLoading } from '../pages/AppLoading';
import { ProfileCreator } from '../pages/ProfileCreator';
import { themeProps } from '../common/theme';
import { IS_DEV } from '../common/consts';
import { BarcodeScan } from '../pages/BarcodeScan';

export const HomeStack = createStackNavigator({
  Home,
  ProductCreate,
  ProductFinder,
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
  ProfileCreator,
  AppLoading
}, { initialRouteName: 'AppLoading' });

export const AppContainer = createAppContainer(RootNavigator);