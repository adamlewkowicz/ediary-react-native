import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class UpdateProductIdColumn1568286894257 implements MigrationInterface {

    tableName = 'product_images';
    columnName = 'productId';

    public async up(queryRunner: QueryRunner): Promise<any> {
        const updatedColumn = new TableColumn({
            name: this.columnName,
            type: 'integer',
            isNullable: false
        });
        await queryRunner.query(`DELETE FROM ${this.tableName} WHERE ${this.columnName} IS NULL`);
        await queryRunner.changeColumn(this.tableName, this.columnName, updatedColumn);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        const previousColumn = new TableColumn({
            name: this.columnName,
            type: 'integer',
            isNullable: true
        });
        await queryRunner.changeColumn(this.tableName, this.columnName, previousColumn);
    }

}
