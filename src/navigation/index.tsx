import { createStackNavigator, createAppContainer, createBottomTabNavigator } from 'react-navigation';
import { Home } from '../pages/Home';
import { ProductCreate } from '../pages/ProductCreate';
import { ProductFinder } from '../pages/ProductFinder';
import { themeProps } from '../common/theme';

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
  Home: HomeStack,
}, {
  initialRouteName: 'Home',
});

export const AppContainer = createAppContainer(AppNavigator);