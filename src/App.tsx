import React from 'react';
import { Provider } from 'react-redux';
import { store, Actions } from './store';
import { ThemeProvider } from 'styled-components/native';
import { theme } from './common/theme';
import { RootStack } from './navigation/RootStack';
import NetInfo, { NetInfoSubscription } from '@react-native-community/netinfo';

interface AppProps {}

export class App extends React.Component<AppProps> {

  unsubscribe: NetInfoSubscription

  constructor(props: AppProps) {
    super(props);

    this.unsubscribe = NetInfo.addEventListener(state => {
      if (store.getState().application.isConnected !== state.isConnected) {
        store.dispatch(
          Actions.appConnectionStatusUpdated(state.isConnected)
        );
      }
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    return (
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <RootStack />
        </ThemeProvider>
      </Provider>
    );
  }
}