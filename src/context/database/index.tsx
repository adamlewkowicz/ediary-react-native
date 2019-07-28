import React, { ReactNode } from 'react';
import { createConnection, getRepository, Connection, Repository, ConnectionManager, getConnection } from 'typeorm/browser';
import * as entities from '../../entities';
import { Text } from 'react-native';

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

  state = {
    connection: null,
    repositories: null,
    isLoading: true
  }

  componentDidMount() {
    this.setupDatabase();
  }

  async setupDatabase() {
    const connection = await createConnection({
      type: 'react-native',
      database: 'test',
      location: 'default',
      logging: ['error', 'query', 'schema'],
      synchronize: false,
      entities: Object.values(entities)
    });

    this.setState({
      connection,
      isLoading: false
    });
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