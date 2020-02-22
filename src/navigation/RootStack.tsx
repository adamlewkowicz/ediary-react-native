import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import {
  AppLoading,
  ProfileCreate,
} from '../screens';
import { NavigationContainer } from '@react-navigation/native';
import { MainStack } from './MainStack';

const Stack = createStackNavigator<RootStackParamList>();

export enum APP_ROUTE {
  HomeStack = 'HomeStack',
  AppLoading = 'AppLoading',
  ProfileCreate = 'ProfileCreate',
  MainStack = 'MainStack',

  Home = 'Home',
  ProductCreate = 'ProductCreate',
  ProductFind = 'ProductFind',
  BarcodeScan = 'BarcodeScan',

  // NutritionHome = 'NutritionHome',
  // NutritionStack = 'NutritionStack',
  DiarySummary = 'DiarySummary',
}

type RootStackParamList = {
  [APP_ROUTE.AppLoading]: undefined;
  [APP_ROUTE.MainStack]: undefined;
  [APP_ROUTE.ProfileCreate]: undefined;
}

export const RootStack = () => (
  <NavigationContainer>
    <Stack.Navigator
      initialRouteName={APP_ROUTE.AppLoading}
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