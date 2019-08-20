import { getDatabaseSchema } from '../utils/getSchema';
import sqlFormatter from 'sql-formatter';

test('entity sql matches snapshot', async () => {
  const tableSchema = await getDatabaseSchema();

  for (const { sql, tbl_name } of tableSchema) {
    if (tbl_name !== 'sqlite_sequence') {
      const prettySql = sqlFormatter.format(sql);
      expect(prettySql).toMatchSnapshot(tbl_name);
    }
  }
});