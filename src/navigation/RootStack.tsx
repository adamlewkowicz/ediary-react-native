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
import { useSelector } from 'react-redux';
import { StoreState } from '../store';

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

export const RootStack = () => {
  const appStatus = useSelector((state: StoreState) => state.application.status);
  
  return (
    <NavigationContainer theme={NAVIGATION_THEME}>
      <Stack.Navigator headerMode="none">
        {appStatus === 'INITIALIZING' ? (
          <Stack.Screen
            name={APP_ROUTE.AppLoading}
            component={AppLoading}
          />
        ) : appStatus === 'CREATING PROFILE' ? (
          <Stack.Screen
            name={APP_ROUTE.ProfileCreate}
            component={ProfileCreate}
          />
        ) : (
          <Stack.Screen
            name={APP_ROUTE.MainStack}
            component={MainStack}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  )
};

const NAVIGATION_THEME: NavigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#fff',
    primary: theme.color.focus,
  },
};