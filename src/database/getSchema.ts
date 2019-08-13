import { getConnection, Connection } from 'typeorm';

export async function getDatabaseSchema(
  connection: Connection = getConnection()
): Promise<string[]> {
  const tableSchema: TableSchema[] = await connection.query(
    `SELECT * FROM sqlite_master WHERE type = "table";`
  );
  return tableSchema.map(schema => schema.sql);
}

interface TableSchema {
  name: string
  rootpage: number
  sql: string
  tbl_name: string
  type: 'table'
}