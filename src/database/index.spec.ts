import { getDatabaseSchema } from './utils/getSchema';
import sqlFormatter from 'sql-formatter';
import { getConnection } from 'typeorm';

test('entity sql matches snapshot', async () => {
  const schema = await getDatabaseSchema();

  for (const { sql, tbl_name } of schema) {
    if (tbl_name !== 'sqlite_sequence') {
      const prettySql = sqlFormatter.format(sql);
      expect(prettySql).toMatchSnapshot(tbl_name);
    }
  }
});

test('migrations run without issues', async () => {
  const connection = getConnection();
  await connection.dropDatabase();
  await connection.runMigrations();
});