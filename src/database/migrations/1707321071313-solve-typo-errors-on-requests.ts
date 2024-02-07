import {MigrationInterface, QueryRunner} from "typeorm";

export class solveTypoErrorsOnRequests1707321071313 implements MigrationInterface {
    name = 'solveTypoErrorsOnRequests1707321071313'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`requests\` CHANGE \`proyectId\` \`projectId\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`requests\` DROP PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`requests\` DROP COLUMN \`projectId\``);
        await queryRunner.query(`ALTER TABLE \`requests\` ADD \`projectId\` varchar(255) NOT NULL PRIMARY KEY`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`requests\` DROP COLUMN \`projectId\``);
        await queryRunner.query(`ALTER TABLE \`requests\` ADD \`projectId\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`requests\` ADD PRIMARY KEY (\`projectId\`)`);
        await queryRunner.query(`ALTER TABLE \`requests\` CHANGE \`projectId\` \`proyectId\` varchar(255) NOT NULL`);
    }

}
