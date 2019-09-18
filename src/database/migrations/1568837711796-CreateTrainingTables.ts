import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateTrainingTables1568837711796 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            CREATE TABLE "exercise_sets" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "repeats" integer NOT NULL,
                "loadWeight" integer NOT NULL,
                "exerciseId" integer NOT NULL,
                CONSTRAINT "FK_5cc32a0e8c2a829a1fe4aac8cc6" FOREIGN KEY ("exerciseId") REFERENCES "exercises" ("id") ON DELETE CASCADE ON UPDATE NO ACTION
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "exercises" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "name" varchar NOT NULL,
                "trainingId" integer NOT NULL,
                CONSTRAINT "FK_178f6e5dd865d9fc8616c10ab7e" FOREIGN KEY ("trainingId") REFERENCES "trainings" ("id") ON DELETE CASCADE ON UPDATE NO ACTION
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "trainings" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "duration" integer NOT NULL,
                "userId" integer NOT NULL,
                CONSTRAINT "FK_adbccaa03aace385b09be0157c1" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE NO ACTION
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropTable('exercise_sets');
        await queryRunner.dropTable('exercises');
        await queryRunner.dropTable('trainings');
    }

}
