import {MigrationInterface, QueryRunner} from "typeorm";

export class updateTableRequests1707416617001 implements MigrationInterface {
    name = 'updateTableRequests1707416617001'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`requests\` DROP PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`requests\` DROP COLUMN \`projectId\``);
        await queryRunner.query(`ALTER TABLE \`requests\` ADD \`id\` int NOT NULL PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`requests\` ADD \`projectId\` varchar(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`requests\` DROP COLUMN \`projectId\``);
        await queryRunner.query(`ALTER TABLE \`requests\` DROP COLUMN \`id\``);
        await queryRunner.query(`ALTER TABLE \`requests\` ADD \`proyectId\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`requests\` ADD PRIMARY KEY (\`proyectId\`)`);
    }

}
