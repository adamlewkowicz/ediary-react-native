import {MigrationInterface, QueryRunner} from "typeorm";

export class AddProductFavorite1586863191204 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            CREATE TABLE "product_favorites" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "productId" integer NOT NULL,
                "userId" integer NOT NULL,
                CONSTRAINT "productId_userId" UNIQUE ("productId", "userId"),
                CONSTRAINT "FK_9e77761f6faae49a6cb68182f1a" FOREIGN KEY ("productId") REFERENCES "product" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
                CONSTRAINT "FK_9599d7698cbd231acf287d7c563" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`DROP TABLE "product_favorites"`);
    }

}
