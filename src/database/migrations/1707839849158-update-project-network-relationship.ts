import {MigrationInterface, QueryRunner} from "typeorm";

export class updateProjectNetworkRelationship1707839849158 implements MigrationInterface {
    name = 'updateProjectNetworkRelationship1707839849158'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`project\` DROP FOREIGN KEY \`FK_e8778611d3b71a80854415a2adb\``);
        await queryRunner.query(`ALTER TABLE \`project\` CHANGE \`chain_id\` \`network_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`project\` ADD CONSTRAINT \`FK_be30eac1fd07fd5fdd074ae2302\` FOREIGN KEY (\`network_id\`) REFERENCES \`network\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`project\` DROP FOREIGN KEY \`FK_be30eac1fd07fd5fdd074ae2302\``);
        await queryRunner.query(`ALTER TABLE \`project\` CHANGE \`network_id\` \`chain_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`project\` ADD CONSTRAINT \`FK_e8778611d3b71a80854415a2adb\` FOREIGN KEY (\`chain_id\`) REFERENCES \`chain\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
