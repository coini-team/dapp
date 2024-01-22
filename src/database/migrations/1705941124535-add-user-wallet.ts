import {MigrationInterface, QueryRunner} from "typeorm";

export class addUserWallet1705941124535 implements MigrationInterface {
    name = 'addUserWallet1705941124535'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`access\` DROP FOREIGN KEY \`FK_2d29a8162ec942b00d044d8e170\``);
        await queryRunner.query(`ALTER TABLE \`access\` DROP FOREIGN KEY \`FK_758d07e24268bb68acfc2ba8d33\``);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`wallet\` varchar(45) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`crypto_network\` ADD \`decimals\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`access\` ADD CONSTRAINT \`FK_2d29a8162ec942b00d044d8e170\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`access\` ADD CONSTRAINT \`FK_758d07e24268bb68acfc2ba8d33\` FOREIGN KEY (\`project_id\`) REFERENCES \`project\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`access\` DROP FOREIGN KEY \`FK_758d07e24268bb68acfc2ba8d33\``);
        await queryRunner.query(`ALTER TABLE \`access\` DROP FOREIGN KEY \`FK_2d29a8162ec942b00d044d8e170\``);
        await queryRunner.query(`ALTER TABLE \`crypto_network\` DROP COLUMN \`decimals\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`wallet\``);
        await queryRunner.query(`ALTER TABLE \`access\` ADD CONSTRAINT \`FK_758d07e24268bb68acfc2ba8d33\` FOREIGN KEY (\`project_id\`) REFERENCES \`project\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`access\` ADD CONSTRAINT \`FK_2d29a8162ec942b00d044d8e170\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
    }

}
