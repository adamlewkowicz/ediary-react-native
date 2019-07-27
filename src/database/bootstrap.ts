import { connectionManager } from './manager';
import * as entities from '../entities';

export async function bootstrapDatabase() {
  const connection = await connectionManager.create({
    type: 'react-native',
    database: 'test',
    location: 'default',
    logging: ['error', 'query', 'schema'],
    synchronize: true,
    entities: Object.values(entities)
  });
  await connection.connect();

  return connection;
}