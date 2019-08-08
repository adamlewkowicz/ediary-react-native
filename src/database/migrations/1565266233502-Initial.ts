import { MigrationInterface, QueryRunner } from 'typeorm';

export class Initial1565266233502 implements MigrationInterface {

	public async up(queryRunner: QueryRunner): Promise<any> {
    const queries =[
      `CREATE TABLE "User" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "email" varchar, "login" varchar NOT NULL, "password" varchar NOT NULL, "createdAt" text NOT NULL DEFAULT (CURRENT_TIMESTAMP), "updatedAt" text NOT NULL DEFAULT (CURRENT_TIMESTAMP))`,
      `CREATE TABLE "portion_type" ("value" varchar PRIMARY KEY NOT NULL)`,
      `CREATE TABLE "profile" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "weight" tinyint NOT NULL, "height" tinyint NOT NULL, "age" tinyint NOT NULL, "male" boolean NOT NULL, "weightGoal" text NOT NULL, "userId" integer NOT NULL, "macroNeedsCarbs" decimal(6,2) NOT NULL DEFAULT (0), "macroNeedsProts" decimal(6,2) NOT NULL DEFAULT (0), "macroNeedsFats" decimal(6,2) NOT NULL DEFAULT (0), "macroNeedsKcal" decimal(6,2) NOT NULL DEFAULT (0), CONSTRAINT "REL_a24972ebd73b106250713dcddd" UNIQUE ("userId"), CONSTRAINT "CHK_e13c7952dc8655e48c8f83608a" CHECK ("weightGoal" IN ('decrease','maintain','increase')), CONSTRAINT "FK_a24972ebd73b106250713dcddd9" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`,
      `CREATE TABLE "Meal" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "carbs" decimal(5,2) NOT NULL DEFAULT (0), "prots" decimal(5,2) NOT NULL DEFAULT (0), "fats" decimal(5,2) NOT NULL DEFAULT (0), "kcal" decimal(5,2) NOT NULL DEFAULT (0), "date" text NOT NULL DEFAULT (CURRENT_TIMESTAMP), "userId" integer NOT NULL DEFAULT (0), CONSTRAINT "FK_65e77ca7ad222ec718355bc67f8" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`,
      `CREATE TABLE "MealProduct" ("mealId" integer NOT NULL, "productId" integer NOT NULL, "quantity" decimal(4,1) NOT NULL, "unit" text NOT NULL DEFAULT ('g'), CONSTRAINT "meal_product" UNIQUE ("mealId", "productId"), CONSTRAINT "CHK_6a20632f081a053128e76d1dd5" CHECK (unit IN ('g','mg','kg','ml','l') ), CONSTRAINT "FK_bfc00136e77833bffc4068b05ad" FOREIGN KEY ("mealId") REFERENCES "Meal" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_cd96ffc0120386a2c88d8177d9d" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, PRIMARY KEY ("mealId", "productId"))`,
      `CREATE TABLE "product_portion" ("productId" integer NOT NULL, "type" varchar NOT NULL, "value" integer NOT NULL, CONSTRAINT "FK_e84015feab6eea65f2d73bc4c94" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, PRIMARY KEY ("productId", "type"))`,
      `CREATE TABLE "Product" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "barcode" text, "carbs" decimal(5,2) NOT NULL DEFAULT (0), "prots" decimal(5,2) NOT NULL DEFAULT (0), "fats" decimal(5,2) NOT NULL DEFAULT (0), "kcal" decimal(5,2) NOT NULL DEFAULT (0), "createdAt" text NOT NULL DEFAULT (CURRENT_TIMESTAMP), "updatedAt" text NOT NULL DEFAULT (CURRENT_TIMESTAMP), "verified" boolean NOT NULL DEFAULT (0), "userId" integer, CONSTRAINT "UQ_320b0ad537731a1b9b1b91b9457" UNIQUE ("barcode"), CONSTRAINT "FK_de75905c3b4987f4b5bb1472644" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`,
    ]
    for (const sql of queries) {
      await queryRunner.query(sql);
    }
	}

	public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`
      PRAGMA writable_schema = 1;
      delete from sqlite_master where type in ('table', 'index', 'trigger');
      PRAGMA writable_schema = 0;
    `);
    await queryRunner.query(`VACUUM;`);
	}

}