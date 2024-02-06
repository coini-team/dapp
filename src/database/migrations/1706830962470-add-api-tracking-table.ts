import {MigrationInterface, QueryRunner} from "typeorm";

export class addApiTrackingTable1706830962470 implements MigrationInterface {
    name = 'addApiTrackingTable1706830962470'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`api_traking\` (\`userId\` varchar(255) NOT NULL, \`endpoint\` varchar(255) NOT NULL, \`api_key\` varchar(255) NULL, \`request\` varchar(255) NULL, \`response\` varchar(255) NOT NULL, \`status_code\` varchar(255) NOT NULL DEFAULT '', \`duration\` int NULL, \`ip\` varchar(255) NULL, \`call_date\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`userId\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`api_traking\``);
    }

}
