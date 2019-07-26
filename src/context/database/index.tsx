import React from 'react';
import { createConnection, getRepository } from 'typeorm/browser';
import * as entities from '../../entities';
import { Text } from 'react-native';

export const DatabaseContext = React.createContext({});

export class DatabaseProvider extends React.Component {

  state = {
    repositories: {},
    isLoading: true
  }

  componentDidMount() {
    this.setupDatabase();
  }

  async setupDatabase() {
    await createConnection({
      type: 'react-native',
      database: 'test',
      location: 'default',
      logging: ['error', 'query', 'schema'],
      synchronize: true,
      entities: Object.values(entities)
    });

    const repositories = Object.entries(entities)
      .reduce((acc, [name, entity]) => ({
        ...acc,
        [name]: getRepository(entity)
      }), {});

    this.setState({
      repositories,
      isLoading: false
    });
  }

  render() {
    
    if (this.state.isLoading) {
      return <Text>Ładowanie bazy danych...</Text>;
    }

    return (
      <DatabaseContext.Provider value={this.state}>
        {this.props.children}
      </DatabaseContext.Provider>
    );
  }
}