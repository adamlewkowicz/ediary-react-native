import { getDatabaseSchema } from './utils/getSchema';
import { getConnection } from 'typeorm';
import snapshotDiff from 'snapshot-diff';

test('entity sql matches snapshot', async () => {
  const schema = await getDatabaseSchema();

  for (const { prettySql, tbl_name } of schema) {
    expect(prettySql).toMatchSnapshot(tbl_name);
  }
});

test('migrations run up and down without issues', async () => {
  const connection = getConnection();
  await connection.dropDatabase();
  await connection.runMigrations();

  for (const migration of connection.migrations) {
    await connection.undoLastMigration();
  }
});

test('entity generated sql matches migrations sql', async () => {
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