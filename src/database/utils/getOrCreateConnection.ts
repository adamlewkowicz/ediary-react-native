import {
  getConnectionManager,
  createConnection,
  ConnectionOptions,
  Connection,
} from 'typeorm';

export async function getOrCreateConnection(
  name: 'default' | 'transactional',
  config: ConnectionOptions
): Promise<Connection> {
  const connectionManager = getConnectionManager();
  const exists = connectionManager.has(name);

  if (exists) {
    return connectionManager.get(name);
  }

  const connection = await createConnection(config);

  return connection;
}