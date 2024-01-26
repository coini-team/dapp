import {MigrationInterface, QueryRunner} from "typeorm";

export class addUserWalletColumn1706288473717 implements MigrationInterface {
    name = 'addUserWalletColumn1706288473717'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`wallet\` varchar(45) NOT NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE \`crypto_network\` CHANGE \`decimals\` \`decimals\` int NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`crypto_network\` CHANGE \`decimals\` \`decimals\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`wallet\``);
    }

}
