import { getDatabaseSchema } from './utils/getSchema';
import { getConnection } from 'typeorm';

describe('Database 🗄️', () => {

  describe('migrations', () => {

    it('should migrate without issues', async () => {
      const connection = getConnection();
      await connection.dropDatabase();
      await connection.runMigrations();
    });

    it('should revert migrations without issues', async () => {
      const connection = getConnection();
      await connection.dropDatabase();
      await connection.runMigrations();
    
      for (const _migration of connection.migrations) {
        await connection.undoLastMigration();
      }
    
      const tables = await getDatabaseSchema();
      expect(tables.length).toBe(0);
    });

  });

  describe('migrated schema', () => {

    it('should match snapshot', async () => {
      const connection = getConnection();
      await connection.dropDatabase();
      await connection.runMigrations();
  
      const schema = await getDatabaseSchema();
  
      for (const { prettySql, tbl_name } of schema) {
        expect(prettySql).toMatchSnapshot(tbl_name);
      }
    });

  });

  describe('automatically generated schema', () => {

    it('should match snapshot', async () => {
      const connection = getConnection();
      await connection.dropDatabase();
      await connection.synchronize();
      const schema = await getDatabaseSchema();
    
      for (const { prettySql, tbl_name } of schema) {
        expect(prettySql).toMatchSnapshot(tbl_name);
      }
    });

  });

});