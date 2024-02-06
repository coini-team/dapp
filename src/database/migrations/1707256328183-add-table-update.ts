import {MigrationInterface, QueryRunner} from "typeorm";

export class addTableUpdate1707256328183 implements MigrationInterface {
    name = 'addTableUpdate1707256328183'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`requests\` (\`proyectId\` varchar(255) NOT NULL, \`endpoint\` varchar(255) NOT NULL, \`access_token\` varchar(255) NULL, \`request\` varchar(255) NULL, \`response\` varchar(255) NOT NULL, \`status_code\` varchar(255) NOT NULL DEFAULT '', \`duration\` int NULL, \`ip\` varchar(255) NULL, \`call_date\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`proyectId\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`requests\``);
    }

}
