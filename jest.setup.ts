import 'core-js/features/array/flat-map';
import 'core-js/features/object/from-entries';
import 'reflect-metadata';
import '@testing-library/jest-native/extend-expect';
import './test-utils/extend-expect';
import { createConnection, getConnection } from 'typeorm';
import { config } from './src/database/config/config';

// Automatically mocks each module property, by provided import path.
jest.mock('react-native/Libraries/Components/ScrollResponder');
jest.mock('react-native/Libraries/LayoutAnimation/LayoutAnimation');

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