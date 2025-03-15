import { MigrationInterface, QueryRunner } from "typeorm";

export class Datasource1741430624272 implements MigrationInterface {
    name = 'Datasource1741430624272'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "datasource" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" character varying NOT NULL, "projectId" character varying NOT NULL, "databaseUrl" character varying, "port" character varying, "username" character varying, "password" character varying, "type" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_5527742558a95839f5e521ada64" UNIQUE ("projectId"), CONSTRAINT "PK_9a969f486c5f1abd362afe73724" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_6a77ec051ba40e54d6ef05143d" ON "datasource" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_5527742558a95839f5e521ada6" ON "datasource" ("projectId") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_5527742558a95839f5e521ada6"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_6a77ec051ba40e54d6ef05143d"`);
        await queryRunner.query(`DROP TABLE "datasource"`);
    }

}
