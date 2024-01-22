import { MigrationInterface, QueryRunner } from 'typeorm';

export class addCryptoNetworkDecimalsColumn1705494082065
  implements MigrationInterface
{
  name = 'addCryptoNetworkDecimalsColumn1705494082065';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`crypto_network\` ADD \`decimals\` int NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`crypto_network\` DROP COLUMN \`decimals\``,
    );
  }
}
