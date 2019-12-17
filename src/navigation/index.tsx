import React from 'react';
import {
  createStackNavigator,
  createAppContainer,
  createBottomTabNavigator,
  createSwitchNavigator,
  NavigationContainer,
} from 'react-navigation';
import {
  Home,
  ProductCreate,
  ProductFind,
  AppLoading,
  ProfileCreate,
  BarcodeScan,
  DiarySummary,
  GymTrainingScreen,
} from '../screens';
import { theme } from '../common/theme';
import { Screen } from '../types';
import { DishIcon, ReportIcon } from '../components/Icons';

const BAR_ICON_SIZE = 22;

export function createHomeStack(
  initialScreen: Screen = 'Home'
): NavigationContainer {
  return createStackNavigator({
    Home,
    ProductCreate,
    ProductFind,
    BarcodeScan,
  }, {
    initialRouteName: initialScreen,
    headerMode: 'screen',
    defaultNavigationOptions: {
      headerTitleStyle: {
        fontFamily: theme.fontWeight.regular
      }
    }
  });
}

export function createMainStack(
  initialScreen: Screen = 'Home',
  initialStack: MainStackScreen = 'Home',
): NavigationContainer {
  const HomeStack = createHomeStack(initialScreen); 

  return createBottomTabNavigator({
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
    GymTrainingScreen: {
      screen: GymTrainingScreen,
      navigationOptions: {
        tabBarLabel: 'Siłownia',
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
    initialRouteName: 'GymTrainingScreen',
    tabBarOptions: {
      showIcon: true,
      activeTintColor: theme.color.blue20,
      labelStyle: {
        fontSize: theme.fontSize.tiny,
        fontFamily: theme.fontWeight.regular,
      }
    }
  });
}

const MainStack = createMainStack();

const RootNavigator = createSwitchNavigator({
  Main: MainStack,
  ProfileCreate,
  AppLoading
}, { initialRouteName: 'AppLoading' });

export const AppContainer = createAppContainer(RootNavigator);

export type MainStackScreen = 'Home' | 'DiarySummary';