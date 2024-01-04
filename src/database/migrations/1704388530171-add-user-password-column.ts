import { MigrationInterface, QueryRunner } from 'typeorm';

export class addUserPasswordColumn1704388530171 implements MigrationInterface {
  name = 'addUserPasswordColumn1704388530171';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`users\` ADD \`password\` varchar(255) NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`password\``);
  }
}
