import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { APP_ROUTE } from './RootStack';
import { BarcodeId } from '../types';
import { Product } from '../database/entities';
import { TakePictureResponse } from 'react-native-camera/types';
import { ProductFind, ProductCreate, BarcodeScan, Home } from '../screens';

const Stack = createStackNavigator<HomeStackParamList>();

type HomeStackParamList = {
  [APP_ROUTE.Home]: undefined;
  [APP_ROUTE.ProductFind]: undefined;
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

export const HomeStack = () => (
  <Stack.Navigator
    initialRouteName={APP_ROUTE.Home}
    headerMode="screen"
  >
    <Stack.Screen
      name={APP_ROUTE.Home}
      component={Home}
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