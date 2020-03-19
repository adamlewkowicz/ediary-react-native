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
  ProductResolver,
} from '../screens';
import { RouteProp } from '@react-navigation/native';
import { theme } from '../common/theme';
import { ProductPreviewScreen } from '../screens/ProductPreview';
import { DiaryProduct } from '../store/reducers/diary';

const Stack = createStackNavigator<NutritionStackParamList>();

export type NutritionStackParamList = {
  [APP_ROUTE.NutritionHome]: {};
  [APP_ROUTE.ProductFind]: {
    onItemPress?: (productResolver: ProductResolver) => void
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
  [APP_ROUTE.ProductPreview]: {
    product: DiaryProduct['data']
    quantity?: number
    onProductQuantityUpdated?: (quantity: number) => void
  };
}

interface NutritionStackProps {
  initialRouteName?: keyof NutritionStackParamList 
}

export const NutritionStack = (props: NutritionStackProps) => {
  const { initialRouteName = APP_ROUTE.NutritionHome } = props;

  return (
    <Stack.Navigator
      initialRouteName={initialRouteName}
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
      <Stack.Screen
        name={APP_ROUTE.ProductPreview}
        component={ProductPreviewScreen}
        options={{ title: 'Dane produktu' }}
      />
    </Stack.Navigator>
  );
}

const SCREEN_OPTIONS: StackNavigationOptions = {
  headerTitleStyle: {
    fontFamily: theme.fontWeight.regular
  }
}

export type NutritionHomeScreenNavigationProps = ScreenProps<'NutritionHome'>;

export type ProductFindScreenNavigationProps = ScreenProps<'ProductFind'>;

export type ProductCreateScreenNavigationProps = ScreenProps<'ProductCreate'>;

export type BarcodeScanScreenNavigationProps = ScreenProps<'BarcodeScan'>;

export type ProductPreviewScreenNavigationProps = ScreenProps<'ProductPreview'>;

type ScreenProps<
  K extends keyof NutritionStackParamList
> = {
  navigation: StackNavigationProp<NutritionStackParamList, K>,
  route: RouteProp<NutritionStackParamList, K>
};