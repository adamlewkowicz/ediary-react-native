import 'reflect-metadata';
import { createConnection, getConnection } from 'typeorm';
import { databaseConfig } from './src/database/config';

console.disableYellowBox = true;

beforeEach(async () => {
  await createConnection(databaseConfig);
});

afterEach(async () => {
  await getConnection().close();
});

jest.mock('NativeAnimatedHelper');

jest.mock('NativeModules', () => ({
  UIManager: {
    RCTView: () => ({
      directEventTypes: {}
    })
  },
  KeyboardObserver: {},
  RNGestureHandlerModule: {
    attachGestureHandler: jest.fn(),
    createGestureHandler: jest.fn(),
    dropGestureHandler: jest.fn(),
    updateGestureHandler: jest.fn(),
    State: {},
    Directions: {}
  }
}));