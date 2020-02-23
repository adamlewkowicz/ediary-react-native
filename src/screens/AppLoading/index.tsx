import React from 'react';
import { ActivityIndicator, Alert } from 'react-native';
import { USER_ID_UNSYNCED, DEFAULT_CONNECTION } from '../../common/consts';
import { store, Actions } from '../../store';
import { User } from '../../database/entities';
import { databaseConfig } from '../../database/config/config';
import { getOrCreateConnection } from '../../database/utils/getOrCreateConnection';
import styled from 'styled-components/native';
import { AppLoadingScreenNavigationProps } from '../../navigation';

interface AppLoadingScreenProps extends AppLoadingScreenNavigationProps {}

export class AppLoadingScreen extends React.Component<AppLoadingScreenProps> {

  async componentDidMount() {
    try {
      await this.setup();
    } catch(error) {
      Alert.alert(
        error.name,
        error.message
      );
    }
  }

  async setup() {
    const defaultConnection = await getOrCreateConnection(
      DEFAULT_CONNECTION, { name: DEFAULT_CONNECTION, ...databaseConfig }
    );

    const hasMigrationsToRun = await defaultConnection.showMigrations();

    if (hasMigrationsToRun) {
      await defaultConnection.runMigrations();
    }

    const user = await User.getOrCreate({
      id: USER_ID_UNSYNCED,
      email: null,
      login: 'login',
      password: 'password',
    });

    store.dispatch(
      Actions.userInitialized(user)
    );

    if (user.profile == null) {
      store.dispatch(
        Actions.appStatusUpdated('CREATING PROFILE')
      );
    } else {
      store.dispatch(
        Actions.appStatusUpdated('INITIALIZED')
      );
    }
  }

  render() {
    return (
      <Spinner size="large" />
    );
  }
}

const Spinner = styled(ActivityIndicator)`
  flex: 1;
`