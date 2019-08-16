import React from 'react';
import { Connection, createConnections } from 'typeorm';
import { ActivityIndicator, Alert } from 'react-native';
import { USER_ID_UNSYNCED } from '../../common/consts';
import { store } from '../../store';
import * as Actions from '../../store/actions';
import { UserRepository } from '../../database/repositories/UserRepository';
import { User } from '../../database/entities';
import { NavigationScreenProps } from 'react-navigation';
import { entitiesArray, migrationsArray, databaseConfig } from '../../database/config';

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
    const [defaultConnection] = await createConnections([
      { name: 'default', ...databaseConfig },
      { name: 'transactional', ...databaseConfig }
    ]);

    // const hasMigrationsToRun = await defaultConnection.showMigrations();

    // if (hasMigrationsToRun) {
      // await defaultConnection.runMigrations();
    // }

    const user = await this.getUser(defaultConnection);

    store.dispatch(
      Actions.appInitialized(user)
    );

    if (user.profile == null) {
      this.props.navigation.navigate('ProfileCreator');
    } else {
      this.props.navigation.navigate('Main');
    }
  }

  async getUser(connection: Connection): Promise<User> {
    const userRepository = connection.getCustomRepository(UserRepository)

    await userRepository
      .findOneOrSave({ where: { id: USER_ID_UNSYNCED }}, {
        id: USER_ID_UNSYNCED,
        email: null,
        login: 'login',
        password: 'password',
      });

    const user = await userRepository
      .findOneOrFail({
        where: { id: USER_ID_UNSYNCED },
        relations: ['profile']
      });

    return user;
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