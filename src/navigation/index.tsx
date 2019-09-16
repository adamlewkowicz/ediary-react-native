import React from 'react';
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
import { DishIcon, ReportIcon } from '../components/Icons';

const BAR_ICON_SIZE = 22;

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
  Home: {
    screen: HomeStack,
    navigationOptions: {
      header: null,
      tabBarLabel: 'Dziennik',
      tabBarIcon: ({ tintColor }: any) => (
        <DishIcon
          width={BAR_ICON_SIZE}
          height={BAR_ICON_SIZE}
          fill={tintColor}
        />
      ),
    }
  },
  DiarySummary: {
    screen: DiarySummary,
    navigationOptions: {
      tabBarLabel: 'Podsumowanie',
      tabBarIcon: ({ tintColor }: any) => (
        <ReportIcon
          width={BAR_ICON_SIZE}
          height={BAR_ICON_SIZE}
          fill={tintColor}
        />
      ),
    }
  },
}, {
  initialRouteName: 'Home',
  tabBarOptions: {
    showIcon: true,
    activeTintColor: theme.color.blue20,
    labelStyle: {
      fontSize: theme.fontSize.tiny,
      fontFamily: theme.fontWeight.regular,
    }
  }
});

const RootNavigator = createSwitchNavigator({
  Main: MainStack,
  ProfileCreate,
  AppLoading
}, { initialRouteName: 'AppLoading' });

export const AppContainer = createAppContainer(RootNavigator);