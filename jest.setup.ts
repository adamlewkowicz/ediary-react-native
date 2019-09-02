import 'core-js/features/array/flat-map';
import 'reflect-metadata';
import '@testing-library/jest-native/extend-expect';
import { createConnection, getConnection } from 'typeorm';
import { config } from './src/database/config/config';
import { NativeModules } from 'react-native';

// console.disableYellowBox = true;

beforeEach(async () => {
  await createConnection(config.test);
});

afterEach(async () => {
  await getConnection().close();
});

// jest.mock('NativeAnimatedHelper');

Object.assign(NativeModules, {
  RNGestureHandlerModule: {
    attachGestureHandler: jest.fn(),
    createGestureHandler: jest.fn(),
    dropGestureHandler: jest.fn(),
    updateGestureHandler: jest.fn(),
    State: {},
    Directions: {}
  },
  // PlatformConstants: {
  //   forceTouchAvailable: false,
  // }
});