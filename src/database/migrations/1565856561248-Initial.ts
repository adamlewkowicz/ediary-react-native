import {MigrationInterface, QueryRunner} from "typeorm";

export class Initial1565856561248 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "profile" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "weight" tinyint NOT NULL, "height" tinyint NOT NULL, "age" tinyint NOT NULL, "male" boolean NOT NULL, "weightGoal" text NOT NULL, "userId" integer NOT NULL, "macroNeedsCarbs" decimal(6,2) NOT NULL DEFAULT (0), "macroNeedsProts" decimal(6,2) NOT NULL DEFAULT (0), "macroNeedsFats" decimal(6,2) NOT NULL DEFAULT (0), "macroNeedsKcal" decimal(6,2) NOT NULL DEFAULT (0), CONSTRAINT "REL_a24972ebd73b106250713dcddd" UNIQUE ("userId"), CONSTRAINT "CHK_e13c7952dc8655e48c8f83608a" CHECK ("weightGoal" IN ('decrease','maintain','increase')))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "email" text, "login" varchar NOT NULL, "password" varchar NOT NULL, "createdAt" text NOT NULL DEFAULT (CURRENT_TIMESTAMP), "updatedAt" text NOT NULL DEFAULT (CURRENT_TIMESTAMP))`);
        await queryRunner.query(`CREATE TABLE "meal" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "carbs" decimal(5,2) NOT NULL DEFAULT (0), "prots" decimal(5,2) NOT NULL DEFAULT (0), "fats" decimal(5,2) NOT NULL DEFAULT (0), "kcal" decimal(5,2) NOT NULL DEFAULT (0), "date" text NOT NULL DEFAULT (CURRENT_TIMESTAMP), "userId" integer)`);
        await queryRunner.query(`CREATE TABLE "meal_product" ("mealId" integer NOT NULL, "productId" integer NOT NULL, "quantity" decimal(4,1) NOT NULL, "unit" text NOT NULL DEFAULT ('g'), CONSTRAINT "CHK_d6cc13b58c966057a531cb8881" CHECK ("unit" IN ('g','mg','kg','ml','l')), PRIMARY KEY ("mealId", "productId"))`);
        await queryRunner.query(`CREATE TABLE "unit_type" ("value" varchar PRIMARY KEY NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "portion_type" ("value" varchar PRIMARY KEY NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "product_portion" ("productId" integer NOT NULL, "type" varchar NOT NULL, "value" integer NOT NULL, CONSTRAINT "REL_0120c2a159028baa53413086e7" UNIQUE ("type"), PRIMARY KEY ("productId", "type"))`);
        await queryRunner.query(`CREATE TABLE "product" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "barcode" text, "carbs" decimal(5,2) NOT NULL DEFAULT (0), "prots" decimal(5,2) NOT NULL DEFAULT (0), "fats" decimal(5,2) NOT NULL DEFAULT (0), "kcal" decimal(5,2) NOT NULL DEFAULT (0), "unit" text NOT NULL DEFAULT ('g'), "createdAt" text NOT NULL DEFAULT (CURRENT_TIMESTAMP), "updatedAt" text NOT NULL DEFAULT (CURRENT_TIMESTAMP), "verified" boolean NOT NULL DEFAULT (0), "userId" integer, CONSTRAINT "UQ_7ac18742b02b8af41afdaa3b9a9" UNIQUE ("barcode"), CONSTRAINT "CHK_def69ab2e188e802b764adeed2" CHECK ("unit" IN ('g','mg','kg','ml','l')))`);
        await queryRunner.query(`CREATE TABLE "temporary_profile" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "weight" tinyint NOT NULL, "height" tinyint NOT NULL, "age" tinyint NOT NULL, "male" boolean NOT NULL, "weightGoal" text NOT NULL, "userId" integer NOT NULL, "macroNeedsCarbs" decimal(6,2) NOT NULL DEFAULT (0), "macroNeedsProts" decimal(6,2) NOT NULL DEFAULT (0), "macroNeedsFats" decimal(6,2) NOT NULL DEFAULT (0), "macroNeedsKcal" decimal(6,2) NOT NULL DEFAULT (0), CONSTRAINT "REL_a24972ebd73b106250713dcddd" UNIQUE ("userId"), CONSTRAINT "CHK_e13c7952dc8655e48c8f83608a" CHECK ("weightGoal" IN ('decrease','maintain','increase')), CONSTRAINT "FK_a24972ebd73b106250713dcddd9" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_profile"("id", "weight", "height", "age", "male", "weightGoal", "userId", "macroNeedsCarbs", "macroNeedsProts", "macroNeedsFats", "macroNeedsKcal") SELECT "id", "weight", "height", "age", "male", "weightGoal", "userId", "macroNeedsCarbs", "macroNeedsProts", "macroNeedsFats", "macroNeedsKcal" FROM "profile"`);
        await queryRunner.query(`DROP TABLE "profile"`);
        await queryRunner.query(`ALTER TABLE "temporary_profile" RENAME TO "profile"`);
        await queryRunner.query(`CREATE TABLE "temporary_meal" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "carbs" decimal(5,2) NOT NULL DEFAULT (0), "prots" decimal(5,2) NOT NULL DEFAULT (0), "fats" decimal(5,2) NOT NULL DEFAULT (0), "kcal" decimal(5,2) NOT NULL DEFAULT (0), "date" text NOT NULL DEFAULT (CURRENT_TIMESTAMP), "userId" integer, CONSTRAINT "FK_419ad998c5e3b37a7cce0f872f5" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_meal"("id", "name", "carbs", "prots", "fats", "kcal", "date", "userId") SELECT "id", "name", "carbs", "prots", "fats", "kcal", "date", "userId" FROM "meal"`);
        await queryRunner.query(`DROP TABLE "meal"`);
        await queryRunner.query(`ALTER TABLE "temporary_meal" RENAME TO "meal"`);
        await queryRunner.query(`CREATE TABLE "temporary_meal_product" ("mealId" integer NOT NULL, "productId" integer NOT NULL, "quantity" decimal(4,1) NOT NULL, "unit" text NOT NULL DEFAULT ('g'), CONSTRAINT "CHK_d6cc13b58c966057a531cb8881" CHECK ("unit" IN ('g','mg','kg','ml','l')), CONSTRAINT "FK_ad97c8c16a4ff39daaf8f464279" FOREIGN KEY ("mealId") REFERENCES "meal" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_769d3e5caceede515715277c784" FOREIGN KEY ("productId") REFERENCES "product" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, PRIMARY KEY ("mealId", "productId"))`);
        await queryRunner.query(`INSERT INTO "temporary_meal_product"("mealId", "productId", "quantity", "unit") SELECT "mealId", "productId", "quantity", "unit" FROM "meal_product"`);
        await queryRunner.query(`DROP TABLE "meal_product"`);
        await queryRunner.query(`ALTER TABLE "temporary_meal_product" RENAME TO "meal_product"`);
        await queryRunner.query(`CREATE TABLE "temporary_product_portion" ("productId" integer NOT NULL, "type" varchar NOT NULL, "value" integer NOT NULL, CONSTRAINT "REL_0120c2a159028baa53413086e7" UNIQUE ("type"), CONSTRAINT "FK_e84015feab6eea65f2d73bc4c94" FOREIGN KEY ("productId") REFERENCES "product" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_0120c2a159028baa53413086e7e" FOREIGN KEY ("type") REFERENCES "unit_type" ("value") ON DELETE NO ACTION ON UPDATE NO ACTION, PRIMARY KEY ("productId", "type"))`);
        await queryRunner.query(`INSERT INTO "temporary_product_portion"("productId", "type", "value") SELECT "productId", "type", "value" FROM "product_portion"`);
        await queryRunner.query(`DROP TABLE "product_portion"`);
        await queryRunner.query(`ALTER TABLE "temporary_product_portion" RENAME TO "product_portion"`);
        await queryRunner.query(`CREATE TABLE "temporary_product" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "barcode" text, "carbs" decimal(5,2) NOT NULL DEFAULT (0), "prots" decimal(5,2) NOT NULL DEFAULT (0), "fats" decimal(5,2) NOT NULL DEFAULT (0), "kcal" decimal(5,2) NOT NULL DEFAULT (0), "unit" text NOT NULL DEFAULT ('g'), "createdAt" text NOT NULL DEFAULT (CURRENT_TIMESTAMP), "updatedAt" text NOT NULL DEFAULT (CURRENT_TIMESTAMP), "verified" boolean NOT NULL DEFAULT (0), "userId" integer, CONSTRAINT "UQ_7ac18742b02b8af41afdaa3b9a9" UNIQUE ("barcode"), CONSTRAINT "CHK_def69ab2e188e802b764adeed2" CHECK ("unit" IN ('g','mg','kg','ml','l')), CONSTRAINT "FK_329b8ae12068b23da547d3b4798" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_product"("id", "name", "barcode", "carbs", "prots", "fats", "kcal", "unit", "createdAt", "updatedAt", "verified", "userId") SELECT "id", "name", "barcode", "carbs", "prots", "fats", "kcal", "unit", "createdAt", "updatedAt", "verified", "userId" FROM "product"`);
        await queryRunner.query(`DROP TABLE "product"`);
        await queryRunner.query(`ALTER TABLE "temporary_product" RENAME TO "product"`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "product" RENAME TO "temporary_product"`);
        await queryRunner.query(`CREATE TABLE "product" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "barcode" text, "carbs" decimal(5,2) NOT NULL DEFAULT (0), "prots" decimal(5,2) NOT NULL DEFAULT (0), "fats" decimal(5,2) NOT NULL DEFAULT (0), "kcal" decimal(5,2) NOT NULL DEFAULT (0), "unit" text NOT NULL DEFAULT ('g'), "createdAt" text NOT NULL DEFAULT (CURRENT_TIMESTAMP), "updatedAt" text NOT NULL DEFAULT (CURRENT_TIMESTAMP), "verified" boolean NOT NULL DEFAULT (0), "userId" integer, CONSTRAINT "UQ_7ac18742b02b8af41afdaa3b9a9" UNIQUE ("barcode"), CONSTRAINT "CHK_def69ab2e188e802b764adeed2" CHECK ("unit" IN ('g','mg','kg','ml','l')))`);
        await queryRunner.query(`INSERT INTO "product"("id", "name", "barcode", "carbs", "prots", "fats", "kcal", "unit", "createdAt", "updatedAt", "verified", "userId") SELECT "id", "name", "barcode", "carbs", "prots", "fats", "kcal", "unit", "createdAt", "updatedAt", "verified", "userId" FROM "temporary_product"`);
        await queryRunner.query(`DROP TABLE "temporary_product"`);
        await queryRunner.query(`ALTER TABLE "product_portion" RENAME TO "temporary_product_portion"`);
        await queryRunner.query(`CREATE TABLE "product_portion" ("productId" integer NOT NULL, "type" varchar NOT NULL, "value" integer NOT NULL, CONSTRAINT "REL_0120c2a159028baa53413086e7" UNIQUE ("type"), PRIMARY KEY ("productId", "type"))`);
        await queryRunner.query(`INSERT INTO "product_portion"("productId", "type", "value") SELECT "productId", "type", "value" FROM "temporary_product_portion"`);
        await queryRunner.query(`DROP TABLE "temporary_product_portion"`);
        await queryRunner.query(`ALTER TABLE "meal_product" RENAME TO "temporary_meal_product"`);
        await queryRunner.query(`CREATE TABLE "meal_product" ("mealId" integer NOT NULL, "productId" integer NOT NULL, "quantity" decimal(4,1) NOT NULL, "unit" text NOT NULL DEFAULT ('g'), CONSTRAINT "CHK_d6cc13b58c966057a531cb8881" CHECK ("unit" IN ('g','mg','kg','ml','l')), PRIMARY KEY ("mealId", "productId"))`);
        await queryRunner.query(`INSERT INTO "meal_product"("mealId", "productId", "quantity", "unit") SELECT "mealId", "productId", "quantity", "unit" FROM "temporary_meal_product"`);
        await queryRunner.query(`DROP TABLE "temporary_meal_product"`);
        await queryRunner.query(`ALTER TABLE "meal" RENAME TO "temporary_meal"`);
        await queryRunner.query(`CREATE TABLE "meal" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "carbs" decimal(5,2) NOT NULL DEFAULT (0), "prots" decimal(5,2) NOT NULL DEFAULT (0), "fats" decimal(5,2) NOT NULL DEFAULT (0), "kcal" decimal(5,2) NOT NULL DEFAULT (0), "date" text NOT NULL DEFAULT (CURRENT_TIMESTAMP), "userId" integer)`);
        await queryRunner.query(`INSERT INTO "meal"("id", "name", "carbs", "prots", "fats", "kcal", "date", "userId") SELECT "id", "name", "carbs", "prots", "fats", "kcal", "date", "userId" FROM "temporary_meal"`);
        await queryRunner.query(`DROP TABLE "temporary_meal"`);
        await queryRunner.query(`ALTER TABLE "profile" RENAME TO "temporary_profile"`);
        await queryRunner.query(`CREATE TABLE "profile" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "weight" tinyint NOT NULL, "height" tinyint NOT NULL, "age" tinyint NOT NULL, "male" boolean NOT NULL, "weightGoal" text NOT NULL, "userId" integer NOT NULL, "macroNeedsCarbs" decimal(6,2) NOT NULL DEFAULT (0), "macroNeedsProts" decimal(6,2) NOT NULL DEFAULT (0), "macroNeedsFats" decimal(6,2) NOT NULL DEFAULT (0), "macroNeedsKcal" decimal(6,2) NOT NULL DEFAULT (0), CONSTRAINT "REL_a24972ebd73b106250713dcddd" UNIQUE ("userId"), CONSTRAINT "CHK_e13c7952dc8655e48c8f83608a" CHECK ("weightGoal" IN ('decrease','maintain','increase')))`);
        await queryRunner.query(`INSERT INTO "profile"("id", "weight", "height", "age", "male", "weightGoal", "userId", "macroNeedsCarbs", "macroNeedsProts", "macroNeedsFats", "macroNeedsKcal") SELECT "id", "weight", "height", "age", "male", "weightGoal", "userId", "macroNeedsCarbs", "macroNeedsProts", "macroNeedsFats", "macroNeedsKcal" FROM "temporary_profile"`);
        await queryRunner.query(`DROP TABLE "temporary_profile"`);
        await queryRunner.query(`DROP TABLE "product"`);
        await queryRunner.query(`DROP TABLE "product_portion"`);
        await queryRunner.query(`DROP TABLE "portion_type"`);
        await queryRunner.query(`DROP TABLE "unit_type"`);
        await queryRunner.query(`DROP TABLE "meal_product"`);
        await queryRunner.query(`DROP TABLE "meal"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "profile"`);
    }

}
