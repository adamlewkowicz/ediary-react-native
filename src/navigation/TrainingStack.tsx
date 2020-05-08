import React from 'react';
import { createStackNavigator, StackNavigationProp, StackNavigationOptions } from '@react-navigation/stack';
import { APP_ROUTE } from './consts';
import {
  RunningScreen,
} from '../screens';
import { RouteProp } from '@react-navigation/native';
import { THEME } from '../common/theme';
import { CountdownScreen } from '../screens/Countdown';
import { TrainingSummaryScreen } from '../screens/TrainingSummary';

const Stack = createStackNavigator<TrainingStackParamList>();

export type TrainingStackParamList = {
  [APP_ROUTE.RunningTraining]: {}
  [APP_ROUTE.Countdown]: {
    countdown: number
    onCountdownEnd: () => void
  };
  [APP_ROUTE.TrainingSummary]: {}
}

interface TrainingStackProps {
  initialRouteName?: keyof TrainingStackParamList 
}

export const TrainingStack = (props: TrainingStackProps) => {
  const { initialRouteName = APP_ROUTE.RunningTraining } = props;

  return (
    <Stack.Navigator
      initialRouteName={initialRouteName}
      screenOptions={SCREEN_OPTIONS}
      headerMode="screen"
    >
      <Stack.Screen
        name={APP_ROUTE.RunningTraining}
        component={RunningScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={APP_ROUTE.Countdown}
        component={CountdownScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={APP_ROUTE.TrainingSummary}
        component={TrainingSummaryScreen}
        options={{ title: 'Podsumowanie treningu' }}
      />
    </Stack.Navigator>
  );
}

const SCREEN_OPTIONS: StackNavigationOptions = {
  headerTitleStyle: {
    fontFamily: THEME.fontWeight.light,
    fontSize: THEME.fontSizeRaw.h3,
  }
}

export type RunningTrainingScreenNavigationProps = ScreenProps<'RunningTraining'>;

export type CountdownScreenNavigationProps = ScreenProps<'Countdown'>;

type ScreenProps<
  K extends keyof TrainingStackParamList
> = {
  navigation: StackNavigationProp<TrainingStackParamList, K>,
  route: RouteProp<TrainingStackParamList, K>
};