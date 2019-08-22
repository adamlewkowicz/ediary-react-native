import React from 'react';
import { ActivityIndicator, Alert } from 'react-native';
import { USER_ID_UNSYNCED } from '../../common/consts';
import { store } from '../../store';
import * as Actions from '../../store/actions';
import { User } from '../../database/entities';
import { NavigationScreenProps } from 'react-navigation';
import { databaseConfig } from '../../database/config/config';
import { getOrCreateConnection } from '../../database/utils/getOrCreateConnection';

interface AppLoadingProps extends NavigationScreenProps {}
interface AppLoadingState {}
export class AppLoading extends React.Component<AppLoadingProps, AppLoadingState> {

  constructor(props: AppLoadingProps) {
    super(props);
  }

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
    const DEFAULT = 'default';
    const TRANSACTIONAL = 'transactional';

    const defaultConnection = await getOrCreateConnection(
      DEFAULT, { name: DEFAULT, ...databaseConfig }
    );
    await getOrCreateConnection(
      TRANSACTIONAL, { name: TRANSACTIONAL, ...databaseConfig }
    );

    // const hasMigrationsToRun = await defaultConnection.showMigrations();

    // if (hasMigrationsToRun) {
      // await defaultConnection.runMigrations();
    // }

    const user = await User.getOrCreate({
      id: USER_ID_UNSYNCED,
      email: null,
      login: 'login',
      password: 'password',
    });

    store.dispatch(
      Actions.appInitialized(user)
    );

    if (user.profile == null) {
      this.props.navigation.navigate('ProfileCreate');
    } else {
      this.props.navigation.navigate('Main');
    }
  }

  handleConnectionStatusUpdate(status: boolean) {
    store.dispatch(
      Actions.appConnectionStatusUpdated(status)
    );
  }

  render() {
    return (
      <ActivityIndicator
        size="large"
        style={{ flex: 1 }}
      />
    );
  }
}