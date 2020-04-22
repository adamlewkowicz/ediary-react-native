import 'core-js/features/array/flat-map';
import 'core-js/features/object/from-entries';
import 'reflect-metadata';
import '@testing-library/jest-native/extend-expect';
import './test-utils/extend-expect';
import { createConnection, getConnection } from 'typeorm';
import { config } from './src/database/config/config';

jest.mock('react-native/Libraries/Components/ScrollResponder');
jest.mock('react-native/Libraries/LayoutAnimation/LayoutAnimation');
jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter');
jest.mock('react-native-gesture-handler/RNGestureHandlerModule');
jest.mock('react-native-reanimated', () => jest.requireActual('react-native-reanimated/mock'));

const globalObject: any = global; 

globalObject.__DEV__ = false;
globalObject.requestIdleCallback = jest.fn((callback: any) => callback());
globalObject.cancelIdleCallback = jest.fn();
globalObject.AbortController = jest.fn(() => ({ signal: {}, abort() {} }));
globalObject.fetch = jest.genMockFromModule('node-fetch');

beforeEach(async () => {
  const connection = await createConnection(config.test);
  await connection.runMigrations();
});

afterEach(async () => {
  await getConnection().close();
  jest.clearAllTimers();
  jest.clearAllMocks();
});