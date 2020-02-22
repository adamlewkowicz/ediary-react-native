import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import {
  AppLoading,
  ProfileCreate,
} from '../screens';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { MainStack } from './MainStack';
import { Theme as NavigationTheme } from '@react-navigation/native/lib/typescript/src/types';
import { theme } from '../common/theme';

const Stack = createStackNavigator<RootStackParamList>();

export const APP_ROUTE = {
  AppLoading: 'AppLoading',
  ProfileCreate: 'ProfileCreate',
  MainStack: 'MainStack',
    NutritionStack: 'NutritionStack',
      NutritionHome: 'NutritionHome',
      ProductCreate: 'ProductCreate',
      ProductFind: 'ProductFind',
      BarcodeScan: 'BarcodeScan',
    DiarySummary: 'DiarySummary',
} as const;

export type RootStackParamList = {
  [APP_ROUTE.AppLoading]: undefined;
  [APP_ROUTE.MainStack]: undefined;
  [APP_ROUTE.ProfileCreate]: undefined;
}

// TODO replace stack with conditional rendering
export const RootStack = () => (
  <NavigationContainer
    theme={NAVIGATION_THEME}
  >
    <Stack.Navigator
      initialRouteName={APP_ROUTE.AppLoading}
      headerMode="none"
    >
      <Stack.Screen
        name={APP_ROUTE.AppLoading}
        component={AppLoading}
      />
      <Stack.Screen
        name={APP_ROUTE.ProfileCreate}
        component={ProfileCreate}
      />
      <Stack.Screen
        name={APP_ROUTE.MainStack}
        component={MainStack}
      />
    </Stack.Navigator>
  </NavigationContainer>
);

const NAVIGATION_THEME: NavigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#fff',
    primary: theme.color.focus,
  },
};