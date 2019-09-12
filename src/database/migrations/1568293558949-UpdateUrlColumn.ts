import {MigrationInterface, QueryRunner} from "typeorm";
import { TableUnique } from 'typeorm/schema-builder/table/TableUnique';

export class UpdateUrlColumn1568293558949 implements MigrationInterface {

    tableName = 'product_images';
    columnName = 'url';
    indexName = 'UQ_58730e63386a62e577a24031ab2'
    uniqueIndex = new TableUnique({
        columnNames: [this.columnName],
        name: this.indexName
    });

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createUniqueConstraint(this.tableName, this.uniqueIndex);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropUniqueConstraint(this.tableName, this.uniqueIndex);
    }

}