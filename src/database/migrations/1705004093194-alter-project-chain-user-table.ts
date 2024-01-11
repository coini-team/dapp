import {MigrationInterface, QueryRunner} from "typeorm";

export class alterProjectChainUserTable1705004093194 implements MigrationInterface {
    name = 'alterProjectChainUserTable1705004093194'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`project\` ADD CONSTRAINT \`FK_e8778611d3b71a80854415a2adb\` FOREIGN KEY (\`chain_id\`) REFERENCES \`chain\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`access\` ADD CONSTRAINT \`FK_2d29a8162ec942b00d044d8e170\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`access\` ADD CONSTRAINT \`FK_758d07e24268bb68acfc2ba8d33\` FOREIGN KEY (\`project_id\`) REFERENCES \`project\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`access\` DROP FOREIGN KEY \`FK_758d07e24268bb68acfc2ba8d33\``);
        await queryRunner.query(`ALTER TABLE \`access\` DROP FOREIGN KEY \`FK_2d29a8162ec942b00d044d8e170\``);
        await queryRunner.query(`ALTER TABLE \`project\` DROP FOREIGN KEY \`FK_e8778611d3b71a80854415a2adb\``);
    }

}
