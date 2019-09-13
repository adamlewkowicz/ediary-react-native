import { getConnection, Connection } from 'typeorm';
import sqlFormatter from 'sql-formatter';

export async function getDatabaseSchema(
  connection: Connection = getConnection(),
  metaTableNames: string[] = ['sqlite_sequence', 'migrations']
): Promise<ExtendedTableSchema[]> {
  const tableSchema: TableSchema[] = await connection.query(
    `SELECT * FROM sqlite_master WHERE type = "table";`
  );
  const normalizedSchema: ExtendedTableSchema[] = tableSchema
    .filter(data => !metaTableNames.includes(data.tbl_name))
    .map(data => ({
      ...data,
      prettySql: sqlFormatter.format(data.sql)
    }))
    .sort((a, b) => a.tbl_name > b.tbl_name ? 1 : -1);
    
  return normalizedSchema;
}

interface ExtendedTableSchema extends TableSchema {
  prettySql: string
}
interface TableSchema {
  name: string
  rootpage: number
  sql: string
  tbl_name: string
  type: 'table'
}