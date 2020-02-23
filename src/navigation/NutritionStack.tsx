import React from 'react';
import { createStackNavigator, StackNavigationProp, StackNavigationOptions } from '@react-navigation/stack';
import { APP_ROUTE } from './consts';
import { BarcodeId } from '../types';
import { Product } from '../database/entities';
import { TakePictureResponse } from 'react-native-camera/types';
import {
  ProductFindScreen,
  ProductCreateScreen,
  BarcodeScanScreen,
  NutritionHomeScreen,
} from '../screens';
import { RouteProp } from '@react-navigation/native';
import { theme } from '../common/theme';

const Stack = createStackNavigator<NutritionStackParamList>();

export type NutritionStackParamList = {
  [APP_ROUTE.NutritionHome]: undefined;
  [APP_ROUTE.ProductFind]: {
    onItemPress?: (product: Product) => void
  };
  [APP_ROUTE.ProductCreate]: {
    barcode?: BarcodeId
    name?: string
    onProductCreated?: (product: Product) => void
  };
  [APP_ROUTE.BarcodeScan]: {
    onBarcodeDetected?: (barcode: BarcodeId) => void
    onPhotoTaken?: (data: TakePictureResponse) => void
  };
}

export const NutritionStack = () => (
  <Stack.Navigator
    initialRouteName={APP_ROUTE.NutritionHome}
    screenOptions={SCREEN_OPTIONS}
    headerMode="screen"
  >
    <Stack.Screen
      name={APP_ROUTE.NutritionHome}
      component={NutritionHomeScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name={APP_ROUTE.ProductFind}
      component={ProductFindScreen}
      options={{ title: 'Znajdź produkt' }}
    />
    <Stack.Screen
      name={APP_ROUTE.ProductCreate}
      component={ProductCreateScreen}
      options={{ title: 'Stwórz produkt' }}
    />
    <Stack.Screen
      name={APP_ROUTE.BarcodeScan}
      component={BarcodeScanScreen}
      options={{ title: 'Zeskanuj kod kreskowy' }}
    />
  </Stack.Navigator>
);

const SCREEN_OPTIONS: StackNavigationOptions = {
  headerTitleStyle: {
    fontFamily: theme.fontWeight.regular
  }
}

export type NutritionHomeScreenNavigationProps = ScreenProps<'NutritionHome'>;

export type ProductFindScreenNavigationProps = ScreenProps<'ProductFind'>;

export type ProductCreateScreenNavigationProps = ScreenProps<'ProductCreate'>;

export type BarcodeScanScreenNavigationProps = ScreenProps<'BarcodeScan'>;

type ScreenProps<
  K extends keyof NutritionStackParamList
> = {
  navigation: StackNavigationProp<NutritionStackParamList, K>,
  route: RouteProp<NutritionStackParamList, K>
};