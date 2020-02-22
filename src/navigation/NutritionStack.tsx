import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { APP_ROUTE } from './RootStack';
import { BarcodeId } from '../types';
import { Product } from '../database/entities';
import { TakePictureResponse } from 'react-native-camera/types';
import { ProductFind, ProductCreate, BarcodeScan, NutritionHome } from '../screens';

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
    /** Internal param for navigation options. */
    _handleProductCreate?: () => void
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
    />
    <Stack.Screen
      name={APP_ROUTE.BarcodeScan}
      component={BarcodeScan}    
    />
  </Stack.Navigator>
);