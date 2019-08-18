import { migrationsArray, entitiesArray } from './config';
import { ConnectionOptions } from 'typeorm';

module.exports = {
  type: 'sqlite',
  database: './test.sqlite',
  logging: ['error'],
  synchronize: false,
  migrations: migrationsArray,
  entities: entitiesArray,
  cli: {
    migrationsDir: './src/database/migrations',
    entitiesDir: './src/database/entities',
  }
} as ConnectionOptions;