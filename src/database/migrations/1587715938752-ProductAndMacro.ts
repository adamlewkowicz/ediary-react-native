import {MigrationInterface, QueryRunner} from "typeorm";

export class ProductAndMacro1587715938752 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "meal" ADD COLUMN "macroFattyacids" decimal(6, 2) NOT NULL DEFAULT (0);`);
        await queryRunner.query(`ALTER TABLE "meal" ADD COLUMN "macroSugars" decimal(6, 2) NOT NULL DEFAULT (0);`);
        
        await queryRunner.query(`ALTER TABLE "product" ADD COLUMN "macroFattyacids" decimal(6, 2) NOT NULL DEFAULT (0);`);
        await queryRunner.query(`ALTER TABLE "product" ADD COLUMN "macroSugars" decimal(6, 2) NOT NULL DEFAULT (0);`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        // @TODO revert changes
        // await queryRunner.query(``);
    }

}
