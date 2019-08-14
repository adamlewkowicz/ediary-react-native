import { ConnectionOptions } from 'typeorm';
import * as entities from './entities';
import * as migrations from './migrations';
import { Environment } from '../types';
import { APP_ENV } from '../common/consts';

const migrationsArray = Object.values(migrations);
const entitiesArray = Object.values(entities);

const config: DatabaseConfig = {
  development: {
    type: 'react-native',
    database: 'test',
    location: 'default',
    logging: ['error', 'query', 'schema'],
    dropSchema: false,
    synchronize: false,
    migrations: migrationsArray,
    entities: entitiesArray
  },
  test: {
    type: 'sqlite',
    database: ':memory:',
    synchronize: true,
    logging: false,
    migrations: migrationsArray,
    entities: entitiesArray
  },
  production: {
    type: 'react-native',
    database: 'test',
    location: 'default',
    logging: ['error', 'query', 'schema'],
    dropSchema: false,
    synchronize: false,
    migrations: migrationsArray,
    entities: entitiesArray
  }
}

export const databaseConfig = config[APP_ENV];

type DatabaseConfig = { [key in Environment]: ConnectionOptions }