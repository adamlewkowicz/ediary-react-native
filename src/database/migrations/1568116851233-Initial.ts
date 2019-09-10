import {MigrationInterface, QueryRunner} from "typeorm";

export class Initial1568116851233 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "profile" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "weight" tinyint NOT NULL, "height" tinyint NOT NULL, "age" tinyint NOT NULL, "male" boolean NOT NULL, "weightGoal" text NOT NULL, "userId" integer NOT NULL, "macroNeedsCarbs" decimal(6,2) NOT NULL DEFAULT (0), "macroNeedsProts" decimal(6,2) NOT NULL DEFAULT (0), "macroNeedsFats" decimal(6,2) NOT NULL DEFAULT (0), "macroNeedsKcal" decimal(6,2) NOT NULL DEFAULT (0), CONSTRAINT "REL_a24972ebd73b106250713dcddd" UNIQUE ("userId"), CONSTRAINT "CHK_e13c7952dc8655e48c8f83608a" CHECK ("weightGoal" IN ('decrease','maintain','increase')))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "email" text, "login" varchar NOT NULL, "password" varchar NOT NULL, "createdAt" text NOT NULL DEFAULT (CURRENT_TIMESTAMP), "updatedAt" text NOT NULL DEFAULT (CURRENT_TIMESTAMP))`);
        await queryRunner.query(`CREATE TABLE "meal" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "date" text NOT NULL DEFAULT (CURRENT_TIMESTAMP), "userId" integer, "macroCarbs" decimal(6,2) NOT NULL DEFAULT (0), "macroProts" decimal(6,2) NOT NULL DEFAULT (0), "macroFats" decimal(6,2) NOT NULL DEFAULT (0), "macroKcal" decimal(6,2) NOT NULL DEFAULT (0))`);
        await queryRunner.query(`CREATE TABLE "meal_product" ("mealId" integer NOT NULL, "productId" integer NOT NULL, "quantity" decimal(4,1) NOT NULL, PRIMARY KEY ("mealId", "productId"))`);
        await queryRunner.query(`CREATE TABLE "product_portions" ("productId" integer NOT NULL, "type" varchar NOT NULL, "value" integer NOT NULL, CONSTRAINT "UQ_422bab5f9d32229ab5eec6f1631" UNIQUE ("productId", "type"), PRIMARY KEY ("productId", "type"))`);
        await queryRunner.query(`CREATE TABLE "product_images" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "url" varchar NOT NULL, "productId" integer)`);
        await queryRunner.query(`CREATE TABLE "product" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "barcode" text, "unit" text NOT NULL DEFAULT ('g'), "createdAt" text NOT NULL DEFAULT (CURRENT_TIMESTAMP), "updatedAt" text NOT NULL DEFAULT (CURRENT_TIMESTAMP), "isVerified" boolean, "userId" integer, "macroCarbs" decimal(6,2) NOT NULL DEFAULT (0), "macroProts" decimal(6,2) NOT NULL DEFAULT (0), "macroFats" decimal(6,2) NOT NULL DEFAULT (0), "macroKcal" decimal(6,2) NOT NULL DEFAULT (0), CONSTRAINT "UQ_3e46cda47a776b779fa6faaed10" UNIQUE ("barcode", "isVerified"), CONSTRAINT "UQ_c1dd1975fe160d2190161668c52" UNIQUE ("barcode", "userId"), CONSTRAINT "UQ_905c0fed2f9ceb88491e43331ec" UNIQUE ("name", "isVerified"), CONSTRAINT "CHK_fc8bb6dce3ee11546ec5f9d2bb" CHECK ("unit" IN ('g','ml')))`);
        await queryRunner.query(`CREATE TABLE "temporary_profile" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "weight" tinyint NOT NULL, "height" tinyint NOT NULL, "age" tinyint NOT NULL, "male" boolean NOT NULL, "weightGoal" text NOT NULL, "userId" integer NOT NULL, "macroNeedsCarbs" decimal(6,2) NOT NULL DEFAULT (0), "macroNeedsProts" decimal(6,2) NOT NULL DEFAULT (0), "macroNeedsFats" decimal(6,2) NOT NULL DEFAULT (0), "macroNeedsKcal" decimal(6,2) NOT NULL DEFAULT (0), CONSTRAINT "REL_a24972ebd73b106250713dcddd" UNIQUE ("userId"), CONSTRAINT "CHK_e13c7952dc8655e48c8f83608a" CHECK ("weightGoal" IN ('decrease','maintain','increase')), CONSTRAINT "FK_a24972ebd73b106250713dcddd9" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_profile"("id", "weight", "height", "age", "male", "weightGoal", "userId", "macroNeedsCarbs", "macroNeedsProts", "macroNeedsFats", "macroNeedsKcal") SELECT "id", "weight", "height", "age", "male", "weightGoal", "userId", "macroNeedsCarbs", "macroNeedsProts", "macroNeedsFats", "macroNeedsKcal" FROM "profile"`);
        await queryRunner.query(`DROP TABLE "profile"`);
        await queryRunner.query(`ALTER TABLE "temporary_profile" RENAME TO "profile"`);
        await queryRunner.query(`CREATE TABLE "temporary_meal" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "date" text NOT NULL DEFAULT (CURRENT_TIMESTAMP), "userId" integer, "macroCarbs" decimal(6,2) NOT NULL DEFAULT (0), "macroProts" decimal(6,2) NOT NULL DEFAULT (0), "macroFats" decimal(6,2) NOT NULL DEFAULT (0), "macroKcal" decimal(6,2) NOT NULL DEFAULT (0), CONSTRAINT "FK_419ad998c5e3b37a7cce0f872f5" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_meal"("id", "name", "date", "userId", "macroCarbs", "macroProts", "macroFats", "macroKcal") SELECT "id", "name", "date", "userId", "macroCarbs", "macroProts", "macroFats", "macroKcal" FROM "meal"`);
        await queryRunner.query(`DROP TABLE "meal"`);
        await queryRunner.query(`ALTER TABLE "temporary_meal" RENAME TO "meal"`);
        await queryRunner.query(`CREATE TABLE "temporary_meal_product" ("mealId" integer NOT NULL, "productId" integer NOT NULL, "quantity" decimal(4,1) NOT NULL, CONSTRAINT "FK_ad97c8c16a4ff39daaf8f464279" FOREIGN KEY ("mealId") REFERENCES "meal" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_769d3e5caceede515715277c784" FOREIGN KEY ("productId") REFERENCES "product" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, PRIMARY KEY ("mealId", "productId"))`);
        await queryRunner.query(`INSERT INTO "temporary_meal_product"("mealId", "productId", "quantity") SELECT "mealId", "productId", "quantity" FROM "meal_product"`);
        await queryRunner.query(`DROP TABLE "meal_product"`);
        await queryRunner.query(`ALTER TABLE "temporary_meal_product" RENAME TO "meal_product"`);
        await queryRunner.query(`CREATE TABLE "temporary_product_portions" ("productId" integer NOT NULL, "type" varchar NOT NULL, "value" integer NOT NULL, CONSTRAINT "UQ_422bab5f9d32229ab5eec6f1631" UNIQUE ("productId", "type"), CONSTRAINT "FK_03c8a652a50d45ef2abcda1db18" FOREIGN KEY ("productId") REFERENCES "product" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, PRIMARY KEY ("productId", "type"))`);
        await queryRunner.query(`INSERT INTO "temporary_product_portions"("productId", "type", "value") SELECT "productId", "type", "value" FROM "product_portions"`);
        await queryRunner.query(`DROP TABLE "product_portions"`);
        await queryRunner.query(`ALTER TABLE "temporary_product_portions" RENAME TO "product_portions"`);
        await queryRunner.query(`CREATE TABLE "temporary_product_images" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "url" varchar NOT NULL, "productId" integer, CONSTRAINT "FK_b367708bf720c8dd62fc6833161" FOREIGN KEY ("productId") REFERENCES "product" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_product_images"("id", "url", "productId") SELECT "id", "url", "productId" FROM "product_images"`);
        await queryRunner.query(`DROP TABLE "product_images"`);
        await queryRunner.query(`ALTER TABLE "temporary_product_images" RENAME TO "product_images"`);
        await queryRunner.query(`CREATE TABLE "temporary_product" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "barcode" text, "unit" text NOT NULL DEFAULT ('g'), "createdAt" text NOT NULL DEFAULT (CURRENT_TIMESTAMP), "updatedAt" text NOT NULL DEFAULT (CURRENT_TIMESTAMP), "isVerified" boolean, "userId" integer, "macroCarbs" decimal(6,2) NOT NULL DEFAULT (0), "macroProts" decimal(6,2) NOT NULL DEFAULT (0), "macroFats" decimal(6,2) NOT NULL DEFAULT (0), "macroKcal" decimal(6,2) NOT NULL DEFAULT (0), CONSTRAINT "UQ_3e46cda47a776b779fa6faaed10" UNIQUE ("barcode", "isVerified"), CONSTRAINT "UQ_c1dd1975fe160d2190161668c52" UNIQUE ("barcode", "userId"), CONSTRAINT "UQ_905c0fed2f9ceb88491e43331ec" UNIQUE ("name", "isVerified"), CONSTRAINT "CHK_fc8bb6dce3ee11546ec5f9d2bb" CHECK ("unit" IN ('g','ml')), CONSTRAINT "FK_329b8ae12068b23da547d3b4798" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_product"("id", "name", "barcode", "unit", "createdAt", "updatedAt", "isVerified", "userId", "macroCarbs", "macroProts", "macroFats", "macroKcal") SELECT "id", "name", "barcode", "unit", "createdAt", "updatedAt", "isVerified", "userId", "macroCarbs", "macroProts", "macroFats", "macroKcal" FROM "product"`);
        await queryRunner.query(`DROP TABLE "product"`);
        await queryRunner.query(`ALTER TABLE "temporary_product" RENAME TO "product"`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`DROP TABLE "product"`);
        await queryRunner.query(`DROP TABLE "product_images"`);
        await queryRunner.query(`DROP TABLE "product_portions"`);
        await queryRunner.query(`DROP TABLE "meal_product"`);
        await queryRunner.query(`DROP TABLE "meal"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "profile"`);
    }

}
