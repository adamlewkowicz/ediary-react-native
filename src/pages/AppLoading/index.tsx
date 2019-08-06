import React from 'react';
import { createConnection, Connection } from 'typeorm/browser';
import * as entities from '../../entities';
import { ActivityIndicator } from 'react-native';
import { USER_ID_UNSYNCED } from '../../common/consts';
import NetInfo, { NetInfoSubscription } from '@react-native-community/netinfo';
import { store } from '../../store';
import * as Actions from '../../store/actions';
import { UserRepository } from '../../repositories/UserRepository';
import { User } from '../../entities';
import { NavigationScreenProps } from 'react-navigation';

interface AppLoadingProps extends NavigationScreenProps {}
interface AppLoadingState {}
export class AppLoading extends React.Component<AppLoadingProps, AppLoadingState> {

  unsubscribe: NetInfoSubscription
  state = {}

  constructor(props: AppLoadingProps) {
    super(props);

    this.unsubscribe = NetInfo.addEventListener(state => {
      this.handleConnectionStatusUpdate(state.isConnected);
    });
  }

  componentDidMount() {
    this.setup();
  }

  async setup() {
    const connection = await createConnection({
      type: 'react-native',
      database: 'test',
      location: 'default',
      logging: ['error', 'query', 'schema'],
      dropSchema: true,
      synchronize: true,
      entities: Object.values(entities)
    });

    const user = await this.getUser(connection);

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

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    return (
      <ActivityIndicator
        size="large"
        style={{ alignSelf: 'center' }}
      />
    );
  }
}