import { createStackNavigator, createAppContainer, createBottomTabNavigator } from 'react-navigation';
import { Home } from '../pages/Home';
import { ProductCreate } from '../pages/ProductCreate';
import { ProductFinder } from '../pages/ProductFinder';
import { themeProps } from '../common/theme';
import { IS_DEV } from '../common/consts';
import { StorybookUIRoot } from '../../storybook/index';

const HomeStack = createStackNavigator({
  Home,
  ProductCreate,
  ProductFinder,
}, {
  headerMode: 'screen',
  defaultNavigationOptions: {
    headerTitleStyle: {
      fontFamily: themeProps.fontFamily
    }
  }
});

export const AppNavigator = createBottomTabNavigator({
  ...IS_DEV && { StoryBook: StorybookUIRoot },
  Home: HomeStack,
}, {
  initialRouteName: IS_DEV ? 'StoryBook' : 'Home',
});

export const AppContainer = createAppContainer(AppNavigator);