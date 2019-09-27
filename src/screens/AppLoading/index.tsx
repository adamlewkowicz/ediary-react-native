import React from 'react';
import { ActivityIndicator, Alert } from 'react-native';
import { USER_ID_UNSYNCED, DEFAULT_CONNECTION } from '../../common/consts';
import { store } from '../../store';
import * as Actions from '../../store/actions';
import { User } from '../../database/entities';
import { NavigationScreenProps } from 'react-navigation';
import { databaseConfig } from '../../database/config/config';
import { getOrCreateConnection } from '../../database/utils/getOrCreateConnection';
import styled from 'styled-components/native';
import SplashScreen from 'react-native-splash-screen';

interface AppLoadingProps extends NavigationScreenProps {}
export class AppLoading extends React.Component<AppLoadingProps> {

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
      Actions.appInitialized(user)
    );

    if (user.profile == null) {
      this.props.navigation.navigate('ProfileCreate');
    } else {
      this.props.navigation.navigate('Main');
    }

    SplashScreen.hide();
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