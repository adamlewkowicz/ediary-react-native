import { entitiesArray } from './config';
import { ConnectionOptions } from 'typeorm';

module.exports = {
  type: 'sqlite',
  database: './test.sqlite',
  logging: ['error'],
  dropSchema: false,
  synchronize: false,
  entities: entitiesArray,
  cli: {
    migrationsDir: './src/database/migrations',
  }
} as ConnectionOptions;