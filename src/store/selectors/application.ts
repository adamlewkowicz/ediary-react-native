import { StoreState } from '..';

export const getAppDate = (state: StoreState) => state.application.date;

export const getAppDay = (state: StoreState) => state.application.day;

export const getAppIsConnected = (state: StoreState) => state.application.isConnected;