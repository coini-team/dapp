import { MigrationInterface, QueryRunner } from 'typeorm';

export class addUserResetPasswordTokenColumn1707813115265
  implements MigrationInterface
{
  name = 'addUserResetPasswordTokenColumn1707813115265';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`users\` ADD \`reset_password_token\` text NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`users\` DROP COLUMN \`reset_password_token\``,
    );
  }
}
