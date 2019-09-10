import { getDatabaseSchema } from './utils/getSchema';
import { getConnection } from 'typeorm';
import snapshotDiff from 'snapshot-diff';

test('migrations run up and down without issues', async () => {
  const connection = getConnection();
  await connection.dropDatabase();
  await connection.runMigrations();

  for (const migration of connection.migrations) {
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

test('entity generated sql matches migration\'s sql', async () => {
  const connection = getConnection();

  await connection.dropDatabase();
  await connection.synchronize();
  const generatedSchema = await getDatabaseSchema();

  await connection.dropDatabase();
  await connection.runMigrations();
  const migrationsSchema = await getDatabaseSchema();

  generatedSchema.forEach((generatedTable, index) => {
    const migratedTable = migrationsSchema[index];
    const snapshotName = `[${generatedTable.tbl_name}] - generated to migrated`;
    
    expect(generatedTable.tbl_name).toEqual(migratedTable.tbl_name);
    expect(
      snapshotDiff(
        migratedTable.prettySql,
        generatedTable.prettySql
      )
    ).toMatchSnapshot(snapshotName);
  });
});