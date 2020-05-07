import React from 'react';
import {
  createBottomTabNavigator,
  BottomTabNavigationProp,
  BottomTabBarOptions,
} from '@react-navigation/bottom-tabs';
import { APP_ROUTE } from './consts';
import { NutritionSummaryScreen } from '../screens';
import { THEME } from '../common/theme';
import { BottomTabBar } from '../components';
import { NutritionStack } from './NutritionStack';
import { RouteProp } from '@react-navigation/native';

const Tab = createBottomTabNavigator<TabStackParamList>();

export type TabStackParamList = {
  [APP_ROUTE.NutritionStack]: undefined;
  [APP_ROUTE.NutritionSummary]: undefined;
}

export const MainStack = () => (
  <Tab.Navigator
    initialRouteName={APP_ROUTE.NutritionStack}
    tabBarOptions={TAB_BAR_OPTIONS}
    tabBar={BottomTabBar}
  >
    <Tab.Screen
      name={APP_ROUTE.NutritionStack}
      component={NutritionStack}
      options={{ tabBarLabel: 'Dziennik' }}
    />
    <Tab.Screen
      name={APP_ROUTE.NutritionSummary}
      component={NutritionSummaryScreen}
      options={{ tabBarLabel: 'Podsumowanie' }}
    />
  </Tab.Navigator>
);

const TAB_BAR_OPTIONS: BottomTabBarOptions = {
  showIcon: true,
  activeTintColor: THEME.color.highlight,
  inactiveTintColor: THEME.color.tertiary,
  labelStyle: {
    fontSize: THEME.fontSizeRaw.small,
    fontFamily: THEME.fontWeight.regular,
  },
};

export type NutritionStackNavigationProp = ScreenProps<'NutritionStack'>;

export type NutritionSummaryScreenNavigationProps = ScreenProps<'NutritionSummary'>;

type ScreenProps<
  K extends keyof TabStackParamList
> = {
  navigation: BottomTabNavigationProp<TabStackParamList, K>,
  route: RouteProp<TabStackParamList, K>
};