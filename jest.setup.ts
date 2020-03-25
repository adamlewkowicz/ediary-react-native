import 'core-js/features/array/flat-map';
import 'core-js/features/object/from-entries';
import 'reflect-metadata';
import '@testing-library/jest-native/extend-expect';
import { createConnection, getConnection } from 'typeorm';
import { config } from './src/database/config/config';
import { NativeModules } from 'react-native';

jest.mock('react-native/Libraries/Components/ScrollResponder');
jest.mock('react-native/Libraries/LayoutAnimation/LayoutAnimation.js');

(global as any).__DEV__ = false;

global.requestIdleCallback = jest.fn((callback: any) => callback());
global.cancelIdleCallback = jest.fn();
(global as any).AbortController = jest.fn(() => ({ signal: {}, abort() {} }));

beforeEach(async () => {
  const connection = await createConnection(config.test);
  await connection.runMigrations();
});

afterEach(async () => {
  await getConnection().close();
  jest.clearAllTimers();
  jest.clearAllMocks();
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