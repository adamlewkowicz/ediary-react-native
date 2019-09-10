import {MigrationInterface, QueryRunner} from "typeorm";

export class Initial1568113955048 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "profile" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "weight" tinyint NOT NULL, "height" tinyint NOT NULL, "age" tinyint NOT NULL, "male" boolean NOT NULL, "weightGoal" text NOT NULL, "userId" integer NOT NULL, "macroNeedsCarbs" decimal(6,2) NOT NULL DEFAULT (0), "macroNeedsProts" decimal(6,2) NOT NULL DEFAULT (0), "macroNeedsFats" decimal(6,2) NOT NULL DEFAULT (0), "macroNeedsKcal" decimal(6,2) NOT NULL DEFAULT (0), CONSTRAINT "REL_a24972ebd73b106250713dcddd" UNIQUE ("userId"), CONSTRAINT "CHK_e13c7952dc8655e48c8f83608a" CHECK ("weightGoal" IN ('decrease','maintain','increase')))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "email" text, "login" varchar NOT NULL, "password" varchar NOT NULL, "createdAt" text NOT NULL DEFAULT (CURRENT_TIMESTAMP), "updatedAt" text NOT NULL DEFAULT (CURRENT_TIMESTAMP))`);
        await queryRunner.query(`CREATE TABLE "meal" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "date" text NOT NULL DEFAULT (CURRENT_TIMESTAMP), "userId" integer, "macroCarbs" decimal(6,2) NOT NULL DEFAULT (0), "macroProts" decimal(6,2) NOT NULL DEFAULT (0), "macroFats" decimal(6,2) NOT NULL DEFAULT (0), "macroKcal" decimal(6,2) NOT NULL DEFAULT (0))`);
        await queryRunner.query(`CREATE TABLE "meal_product" ("mealId" integer NOT NULL, "productId" integer NOT NULL, "quantity" decimal(4,1) NOT NULL, PRIMARY KEY ("mealId", "productId"))`);
        await queryRunner.query(`CREATE TABLE "product_portions" ("productId" integer NOT NULL, "type" varchar NOT NULL, "value" integer NOT NULL, CONSTRAINT "UQ_422bab5f9d32229ab5eec6f1631" UNIQUE ("productId", "type"), PRIMARY KEY ("productId", "type"))`);
        await queryRunner.query(`CREATE TABLE "product_images" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "url" varchar NOT NULL, "productId" integer)`);
        await queryRunner.query(`CREATE TABLE "product" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "barcode" text, "unit" text NOT NULL DEFAULT ('g'), "createdAt" text NOT NULL DEFAULT (CURRENT_TIMESTAMP), "updatedAt" text NOT NULL DEFAULT (CURRENT_TIMESTAMP), "isVerified" boolean, "userId" integer, "macroCarbs" decimal(6,2) NOT NULL DEFAULT (0), "macroProts" decimal(6,2) NOT NULL DEFAULT (0), "macroFats" decimal(6,2) NOT NULL DEFAULT (0), "macroKcal" decimal(6,2) NOT NULL DEFAULT (0), CONSTRAINT "UQ_3e46cda47a776b779fa6faaed10" UNIQUE ("barcode", "isVerified"), CONSTRAINT "UQ_c1dd1975fe160d2190161668c52" UNIQUE ("barcode", "userId"), CONSTRAINT "UQ_905c0fed2f9ceb88491e43331ec" UNIQUE ("name", "isVerified"), CONSTRAINT "CHK_fc8bb6dce3ee11546ec5f9d2bb" CHECK ("unit" IN ('g','ml')))`);
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
