import { MigrationInterface, QueryRunner } from 'typeorm';

export class addTimestampAndStatusColumn1704299890787
  implements MigrationInterface
{
  name = 'addTimestampAndStatusColumn1704299890787';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`roles\` ADD \`status\` enum ('active', 'inactive') NOT NULL DEFAULT 'active'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`chain\` ADD \`status\` enum ('active', 'inactive') NOT NULL DEFAULT 'active'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`chain\` ADD \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`chain\` ADD \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`network\` ADD \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`network\` ADD \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`crypto\` ADD \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`crypto\` ADD \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`crypto_network\` ADD \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`crypto_network\` ADD \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`wallet\` ADD \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`wallet\` ADD \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`,
    );
    await queryRunner.query(`ALTER TABLE \`project\` DROP COLUMN \`status\``);
    await queryRunner.query(
      `ALTER TABLE \`project\` ADD \`status\` enum ('active', 'inactive') NOT NULL DEFAULT 'active'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`project\` DROP COLUMN \`created_at\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`project\` ADD \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`project\` DROP COLUMN \`updated_at\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`project\` ADD \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`receiver_wallet\` ADD \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`receiver_wallet\` ADD \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`project\` DROP COLUMN \`updated_at\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`project\` ADD \`updated_at\` datetime(0) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`project\` DROP COLUMN \`created_at\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`project\` ADD \`created_at\` datetime(0) NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE \`project\` DROP COLUMN \`status\``);
    await queryRunner.query(
      `ALTER TABLE \`project\` ADD \`status\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`wallet\` DROP COLUMN \`updated_at\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`wallet\` DROP COLUMN \`created_at\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`crypto_network\` DROP COLUMN \`updated_at\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`crypto_network\` DROP COLUMN \`created_at\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`crypto\` DROP COLUMN \`updated_at\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`crypto\` DROP COLUMN \`created_at\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`network\` DROP COLUMN \`updated_at\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`network\` DROP COLUMN \`created_at\``,
    );
    await queryRunner.query(`ALTER TABLE \`chain\` DROP COLUMN \`updated_at\``);
    await queryRunner.query(`ALTER TABLE \`chain\` DROP COLUMN \`created_at\``);
    await queryRunner.query(`ALTER TABLE \`chain\` DROP COLUMN \`status\``);
    await queryRunner.query(`ALTER TABLE \`roles\` DROP COLUMN \`status\``);
    await queryRunner.query(
      `ALTER TABLE \`receiver_wallet\` DROP COLUMN \`updated_at\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`receiver_wallet\` DROP COLUMN \`created_at\``,
    );
  }
}
