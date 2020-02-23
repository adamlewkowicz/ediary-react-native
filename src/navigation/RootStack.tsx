import React from 'react';
import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack';
import {
  AppLoading,
  ProfileCreate,
} from '../screens';
import { NavigationContainer, DefaultTheme, RouteProp } from '@react-navigation/native';
import { MainStack } from './MainStack';
import { Theme as NavigationTheme } from '@react-navigation/native/lib/typescript/src/types';
import { theme } from '../common/theme';
import { useSelector } from 'react-redux';
import { getAppStatus } from '../store/selectors';

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
  const appStatus = useSelector(getAppStatus);
  
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

export type AppLoadingScreenNavigationProps = ScreenProps<'AppLoading'>;

export type ProfileCreateScreenNavigationProps = ScreenProps<'ProfileCreate'>;

export type MainStackNavigationProps = ScreenProps<'MainStack'>;

type ScreenProps<
  K extends keyof RootStackParamList
> = {
  navigation: StackNavigationProp<RootStackParamList, K>,
  route: RouteProp<RootStackParamList, K>
};