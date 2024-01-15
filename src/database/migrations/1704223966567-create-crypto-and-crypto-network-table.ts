import { MigrationInterface, QueryRunner } from 'typeorm';

export class createCryptoAndCryptoNetworkTable1704223966567
  implements MigrationInterface
{
  name = 'createCryptoAndCryptoNetworkTable1704223966567';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`crypto\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(20) NOT NULL, \`icon\` varchar(50) NOT NULL, \`status\` enum ('active', 'inactive') NOT NULL DEFAULT 'active', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`crypto_network\` (\`id\` int NOT NULL AUTO_INCREMENT, \`contract\` varchar(50) NOT NULL, \`status\` enum ('active', 'inactive') NOT NULL DEFAULT 'active', \`network_id\` int NULL, \`crypto_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`crypto_network\` ADD CONSTRAINT \`FK_dfb12081e312f7a4f8c19b10e42\` FOREIGN KEY (\`network_id\`) REFERENCES \`network\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`crypto_network\` ADD CONSTRAINT \`FK_41792f7465e9a24b7472efbcb62\` FOREIGN KEY (\`crypto_id\`) REFERENCES \`crypto\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`crypto_network\` DROP FOREIGN KEY \`FK_41792f7465e9a24b7472efbcb62\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`crypto_network\` DROP FOREIGN KEY \`FK_dfb12081e312f7a4f8c19b10e42\``,
    );
    await queryRunner.query(`DROP TABLE \`crypto_network\``);
    await queryRunner.query(`DROP TABLE \`crypto\``);
  }
}
