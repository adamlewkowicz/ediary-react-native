import React from 'react';
import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack';
import { APP_ROUTE } from './RootStack';
import { BarcodeId } from '../types';
import { Product } from '../database/entities';
import { TakePictureResponse } from 'react-native-camera/types';
import { ProductFind, ProductCreate, BarcodeScan, NutritionHome } from '../screens';
import { RouteProp } from '@react-navigation/native';

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
    headerMode="screen"
  >
    <Stack.Screen
      name={APP_ROUTE.NutritionHome}
      component={NutritionHome}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name={APP_ROUTE.ProductFind}
      component={ProductFind}    
    />
    <Stack.Screen
      name={APP_ROUTE.ProductCreate}
      component={ProductCreate}
      options={{ title: 'Stwórz produkt' }}
    />
    <Stack.Screen
      name={APP_ROUTE.BarcodeScan}
      component={BarcodeScan}    
    />
  </Stack.Navigator>
);

export type ProductFindScreenNavigationProps = Combine<
  NutritionStackParamList,
  'ProductFind'
>;

export type ProductCreateScreenNavigationProps = Combine<
  NutritionStackParamList,
  'ProductCreate'
>;

type Combine<
  L extends NutritionStackParamList,
  K extends keyof L
> = {
  navigation: StackNavigationProp<L, K>,
  route: RouteProp<L, K>
};