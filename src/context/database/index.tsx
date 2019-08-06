import React, { ReactNode } from 'react';
import { createConnection, Connection, Repository } from 'typeorm/browser';
import * as entities from '../../entities';
import { Text } from 'react-native';
import { USER_ID_UNSYNCED } from '../../common/consts';
import NetInfo, { NetInfoSubscription } from '@react-native-community/netinfo';
import { store } from '../../store';
import * as Actions from '../../store/actions';
import { UserRepository } from '../../repositories/UserRepository';

export const DatabaseContext = React.createContext<DatabaseContext>({} as any);

interface DatabaseProviderProps {
  children: ReactNode 
}
interface DatabaseProviderState {
  isLoading: boolean
  connection: null | Connection
  repositories: null | Repositories 
}
export class DatabaseProvider extends React.Component<DatabaseProviderProps, DatabaseProviderState> {

  unsubscribe: NetInfoSubscription

  state = {
    connection: null,
    repositories: null,
    isLoading: true
  }

  constructor(props: DatabaseProviderProps) {
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

    await connection
      .getCustomRepository(UserRepository)
      .findOneOrSave({ where: { id: USER_ID_UNSYNCED }}, {
        id: USER_ID_UNSYNCED,
        email: null,
        login: 'login',
        password: 'password',
      });

    const user = await connection
      .getCustomRepository(UserRepository)
      .findOneOrFail({
        where: { id: USER_ID_UNSYNCED },
        relations: ['profile']
      });

    store.dispatch(
      Actions.appInitialized(user)
    );

    this.setState({
      connection,
      isLoading: false
    });
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
    
    if (this.state.isLoading) {
      return <Text>Ładowanie bazy danych...</Text>;
    }

    return (
      <DatabaseContext.Provider value={this.state as any}>
        {this.props.children}
      </DatabaseContext.Provider>
    );
  }
}

type Repositories = {
  [key in keyof typeof entities]: Repository<typeof entities>
}

interface DatabaseContext extends DatabaseProviderState {
  connection: Connection
  repositories: Repositories
}