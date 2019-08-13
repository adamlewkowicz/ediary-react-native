import * as entities from './entities';
import { createConnection } from 'typeorm';

export async function bootstrapDatabase() {
  const connection = await createConnection({
    type: 'react-native',
    database: 'test',
    location: 'default',
    logging: ['error', 'query', 'schema'],
    synchronize: true,
    entities: Object.values(entities)
  });
  return connection;
}