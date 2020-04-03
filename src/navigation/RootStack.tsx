import React from 'react';
import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack';
import {
  AppLoadingScreen,
  ProfileCreateScreen,
} from '../screens';
import { NavigationContainer, DefaultTheme, RouteProp } from '@react-navigation/native';
import { MainStack } from './MainStack';
import { Theme as NavigationTheme } from '@react-navigation/native/lib/typescript/src/types';
import { theme } from '../common/theme';
import { useSelector } from 'react-redux';
import { APP_ROUTE } from './consts';
import { Selectors } from '../store';
import { useNetworkSubscription } from '../hooks';

const Stack = createStackNavigator<RootStackParamList>();

export type RootStackParamList = {
  [APP_ROUTE.AppLoading]: undefined;
  [APP_ROUTE.MainStack]: undefined;
  [APP_ROUTE.ProfileCreate]: undefined;
}

export const RootStack = () => {
  useNetworkSubscription();
  const appStatus = useSelector(Selectors.getAppStatus);
  
  return (
    <NavigationContainer theme={NAVIGATION_THEME}>
      <Stack.Navigator headerMode="none">
        {appStatus === 'INITIALIZING' ? (
          <Stack.Screen
            name={APP_ROUTE.AppLoading}
            component={AppLoadingScreen}
          />
        ) : appStatus === 'CREATING PROFILE' ? (
          <Stack.Screen
            name={APP_ROUTE.ProfileCreate}
            component={ProfileCreateScreen}
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
    background: theme.color.primaryLight,
    primary: theme.color.focus,
    text: theme.color.primary,
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