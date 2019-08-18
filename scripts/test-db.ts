(global as any).__DEV__ = true;
import 'reflect-metadata';
import { createConnection } from 'typeorm';
import { migrationsArray, entitiesArray } from '../src/database/config/config';

(async () => {
  await createConnection({
    type: 'sqlite',
    database: './test.sqlite',
    dropSchema: true,
    synchronize: true,
    logging: 'all',
    migrations: migrationsArray,
    entities: entitiesArray
  });
})();