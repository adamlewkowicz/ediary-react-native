import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { APP_ROUTE } from './RootStack';
import { DiarySummary, Home as NutritionHome } from '../screens';
import { theme } from '../common/theme';
import { ReportIcon, DishIcon } from '../components/Icons';

const Tab = createBottomTabNavigator<TabStackParamList>();

type TabStackParamList = {
  [APP_ROUTE.DiarySummary]: undefined;
  [APP_ROUTE.Home]: undefined;
}

export const MainStack = () => (
  <Tab.Navigator
    initialRouteName={APP_ROUTE.Home}
    tabBarOptions={TAB_BAR_OPTIONS}
  >
    <Tab.Screen
      name={APP_ROUTE.Home}
      component={NutritionHome}
      options={{
        tabBarLabel: 'Dziennik',
        tabBarIcon: ({ color }) => (
          <DishIcon
            {...TAB_ICON_SIZE}
            fill={color}
          />
        ),
      }}
    />
    <Tab.Screen
      name={APP_ROUTE.DiarySummary}
      component={DiarySummary}
      options={{
        tabBarLabel: 'Podsumowanie',
        tabBarIcon: ({ color }) => (
          <ReportIcon
            {...TAB_ICON_SIZE}
            fill={color}
          />
        ),
      }}
    />
  </Tab.Navigator>
);

const TAB_BAR_OPTIONS = {
  showIcon: true,
  activeTintColor: theme.color.blue30,
  labelStyle: {
    fontSize: theme.fontSize.tiny,
    fontFamily: theme.fontWeight.regular,
  }
};

const TAB_ICON_SIZE = {
  width: 22,
  height: 22,
};