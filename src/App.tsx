import React from 'react';
import { mapping, light as lightTheme } from '@eva-design/eva';
import { ApplicationProvider } from 'react-native-ui-kitten';
import { Provider } from 'react-redux';
import { store, Actions } from './store';
import { ThemeProvider } from 'styled-components/native';
import { theme } from './common/theme';
import { AppContainer } from './navigation';
import NetInfo, { NetInfoSubscription } from '@react-native-community/netinfo';
import { MobxStoreProvider } from './context/MobxStore';

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
          <ApplicationProvider
            mapping={mapping}
            theme={lightTheme}
          >
            <MobxStoreProvider>
              <AppContainer />
            </MobxStoreProvider>
          </ApplicationProvider>
        </ThemeProvider>
      </Provider>
    );
  }
}