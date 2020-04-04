import React from 'react';
import {
  createBottomTabNavigator,
  BottomTabNavigationProp,
  BottomTabBarOptions,
} from '@react-navigation/bottom-tabs';
import { APP_ROUTE } from './consts';
import { DiarySummaryScreen } from '../screens';
import { THEME } from '../common/theme';
import { ReportIcon, DishIcon } from '../components';
import { NutritionStack } from './NutritionStack';
import { RouteProp } from '@react-navigation/native';

const Tab = createBottomTabNavigator<TabStackParamList>();

export type TabStackParamList = {
  [APP_ROUTE.NutritionStack]: undefined;
  [APP_ROUTE.DiarySummary]: undefined;
}

export const MainStack = () => (
  <Tab.Navigator
    initialRouteName={APP_ROUTE.NutritionStack}
    tabBarOptions={TAB_BAR_OPTIONS}
    screenOptions={({ route }) => ({
      tabBarIcon: ({ color }) => {
        const Icon = TAB_BAR_ICON[route.name];
        return <Icon fill={color} {...TAB_ICON_SIZE} />;
      },
    })}
  >
    <Tab.Screen
      name={APP_ROUTE.NutritionStack}
      component={NutritionStack}
      options={{ tabBarLabel: 'Dziennik' }}
    />
    <Tab.Screen
      name={APP_ROUTE.DiarySummary}
      component={DiarySummaryScreen}
      options={{ tabBarLabel: 'Podsumowanie' }}
    />
  </Tab.Navigator>
);

const TAB_BAR_OPTIONS: BottomTabBarOptions = {
  showIcon: true,
  activeTintColor: THEME.color.highlight,
  labelStyle: {
    fontSize: THEME.fontSize.small,
    fontFamily: THEME.fontWeight.regular,
  },
};

const TAB_ICON_SIZE = {
  width: 22,
  height: 22,
};

const TAB_BAR_ICON = {
  [APP_ROUTE.NutritionStack]: DishIcon,
  [APP_ROUTE.DiarySummary]: ReportIcon,
};

export type NutritionStackNavigationProp = ScreenProps<'NutritionStack'>;

export type DiarySummaryScreenNavigationProps = ScreenProps<'DiarySummary'>;

type ScreenProps<
  K extends keyof TabStackParamList
> = {
  navigation: BottomTabNavigationProp<TabStackParamList, K>,
  route: RouteProp<TabStackParamList, K>
};