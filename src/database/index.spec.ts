import { getDatabaseSchema } from './utils/getSchema';
import { getConnection } from 'typeorm';
import snapshotDiff from 'snapshot-diff';

test('migrations run up and down without issues', async () => {
  const connection = getConnection();
  await connection.dropDatabase();
  await connection.runMigrations();

  for (const _migration of connection.migrations) {
    await connection.undoLastMigration();
  }

  const tables = await getDatabaseSchema();
  expect(tables.length).toBe(0);
});

test('entity generated sql matches snapshot', async () => {
  const connection = getConnection();
  await connection.dropDatabase();
  await connection.synchronize();
  const schema = await getDatabaseSchema();

  for (const { prettySql, tbl_name } of schema) {
    expect(prettySql).toMatchSnapshot(tbl_name);
  }
});