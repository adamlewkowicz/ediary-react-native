import 'core-js/features/array/flat-map';
import 'reflect-metadata';
import '@testing-library/jest-native/extend-expect';
import { createConnection, getConnection } from 'typeorm';
import { config } from './src/database/config/config';
import { NativeModules } from 'react-native';

(global as any).requestIdleCallback = jest.fn((callback: () => void) => callback());

beforeEach(async () => {
  const connection = await createConnection(config.test);
  await connection.runMigrations();
});

afterEach(async () => {
  await getConnection().close();
});

Object.assign(NativeModules, {
  RNGestureHandlerModule: {
    attachGestureHandler: jest.fn(),
    createGestureHandler: jest.fn(),
    dropGestureHandler: jest.fn(),
    updateGestureHandler: jest.fn(),
    State: {},
    Directions: {},
  }
});