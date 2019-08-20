import { getConnection, Connection } from 'typeorm';

export async function getDatabaseSchema(
  connection: Connection = getConnection()
): Promise<TableSchema[]> {
  const tableSchema: TableSchema[] = await connection.query(
    `SELECT * FROM sqlite_master WHERE type = "table";`
  );
  return tableSchema;
}

interface TableSchema {
  name: string
  rootpage: number
  sql: string
  tbl_name: string
  type: 'table'
}