import { ConnectionOptions } from 'typeorm/browser';
import * as entities from '../entities';
import * as migrations from './migrations';

export const databaseConfig: ConnectionOptions = {
  "type": "react-native",
  "database": "test",
  "location": "default",
  "logging": ["error", "query", "schema"],
  "dropSchema": false,
  "synchronize": false,
  "migrations": Object.values(migrations),
  "entities": Object.values(entities),
  "cli": {
    "migrationsDir": "src/database/migrations",
    "entitiesDir": "src/entities"
  }
}