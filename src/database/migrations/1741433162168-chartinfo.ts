import { MigrationInterface, QueryRunner } from "typeorm";

export class Chartinfo1741433162168 implements MigrationInterface {
    name = 'Chartinfo1741433162168'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "chart_info" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" character varying NOT NULL, "chartName" character varying NOT NULL, "datasourceId" uuid NOT NULL, "chartType" character varying NOT NULL, "xAxis" character varying NOT NULL, "yAxis" character varying NOT NULL, "prompt" character varying NOT NULL, "queryData" text NOT NULL, "chartData" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_ec886493273a391a5d7706711e0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_3b5a3367f0acfe4ff52a8093ad" ON "chart_info" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_fac2ff11af9ae8efcbbf07177b" ON "chart_info" ("datasourceId") `);
        await queryRunner.query(`ALTER TABLE "chart_info" ADD CONSTRAINT "FK_fac2ff11af9ae8efcbbf07177ba" FOREIGN KEY ("datasourceId") REFERENCES "datasource"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "chart_info" DROP CONSTRAINT "FK_fac2ff11af9ae8efcbbf07177ba"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_fac2ff11af9ae8efcbbf07177b"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_3b5a3367f0acfe4ff52a8093ad"`);
        await queryRunner.query(`DROP TABLE "chart_info"`);
    }

}
