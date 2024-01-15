import { MigrationInterface, QueryRunner } from 'typeorm';

export class fixMigrationTable1705338789757 implements MigrationInterface {
  name = 'fixMigrationTable1705338789757';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`access\` (\`user_id\` varchar(36) NOT NULL, \`project_id\` varchar(36) NOT NULL, INDEX \`IDX_2d29a8162ec942b00d044d8e17\` (\`user_id\`), INDEX \`IDX_758d07e24268bb68acfc2ba8d3\` (\`project_id\`), PRIMARY KEY (\`user_id\`, \`project_id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(`ALTER TABLE \`project\` DROP COLUMN \`api_key\``);
    await queryRunner.query(
      `ALTER TABLE \`project\` ADD \`description\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`project\` ADD \`access_token\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`project\` ADD \`refresh_token\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`project\` ADD \`chain_id\` int NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_roles\` DROP FOREIGN KEY \`FK_87b8888186ca9769c960e926870\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`users\` CHANGE \`id\` \`id\` int NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE \`users\` DROP PRIMARY KEY`);
    await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`id\``);
    await queryRunner.query(
      `ALTER TABLE \`users\` ADD \`id\` varchar(36) NOT NULL PRIMARY KEY`,
    );
    await queryRunner.query(
      `ALTER TABLE \`project\` CHANGE \`id\` \`id\` int NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE \`project\` DROP PRIMARY KEY`);
    await queryRunner.query(`ALTER TABLE \`project\` DROP COLUMN \`id\``);
    await queryRunner.query(
      `ALTER TABLE \`project\` ADD \`id\` varchar(36) NOT NULL PRIMARY KEY`,
    );
    await queryRunner.query(`ALTER TABLE \`project\` DROP COLUMN \`mode\``);
    await queryRunner.query(
      `ALTER TABLE \`project\` ADD \`mode\` enum ('development', 'production') NOT NULL DEFAULT 'development'`,
    );
    await queryRunner.query(`ALTER TABLE \`user_roles\` DROP PRIMARY KEY`);
    await queryRunner.query(
      `ALTER TABLE \`user_roles\` ADD PRIMARY KEY (\`role_id\`)`,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_87b8888186ca9769c960e92687\` ON \`user_roles\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_roles\` DROP COLUMN \`user_id\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_roles\` ADD \`user_id\` varchar(36) NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE \`user_roles\` DROP PRIMARY KEY`);
    await queryRunner.query(
      `ALTER TABLE \`user_roles\` ADD PRIMARY KEY (\`role_id\`, \`user_id\`)`,
    );
    await queryRunner.query(
      `CREATE INDEX \`IDX_87b8888186ca9769c960e92687\` ON \`user_roles\` (\`user_id\`)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`project\` ADD CONSTRAINT \`FK_e8778611d3b71a80854415a2adb\` FOREIGN KEY (\`chain_id\`) REFERENCES \`chain\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_roles\` ADD CONSTRAINT \`FK_87b8888186ca9769c960e926870\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`access\` ADD CONSTRAINT \`FK_2d29a8162ec942b00d044d8e170\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`access\` ADD CONSTRAINT \`FK_758d07e24268bb68acfc2ba8d33\` FOREIGN KEY (\`project_id\`) REFERENCES \`project\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`access\` DROP FOREIGN KEY \`FK_758d07e24268bb68acfc2ba8d33\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`access\` DROP FOREIGN KEY \`FK_2d29a8162ec942b00d044d8e170\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_roles\` DROP FOREIGN KEY \`FK_87b8888186ca9769c960e926870\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`project\` DROP FOREIGN KEY \`FK_e8778611d3b71a80854415a2adb\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_87b8888186ca9769c960e92687\` ON \`user_roles\``,
    );
    await queryRunner.query(`ALTER TABLE \`user_roles\` DROP PRIMARY KEY`);
    await queryRunner.query(
      `ALTER TABLE \`user_roles\` ADD PRIMARY KEY (\`role_id\`)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_roles\` DROP COLUMN \`user_id\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_roles\` ADD \`user_id\` int NOT NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX \`IDX_87b8888186ca9769c960e92687\` ON \`user_roles\` (\`user_id\`)`,
    );
    await queryRunner.query(`ALTER TABLE \`user_roles\` DROP PRIMARY KEY`);
    await queryRunner.query(
      `ALTER TABLE \`user_roles\` ADD PRIMARY KEY (\`role_id\`, \`user_id\`)`,
    );
    await queryRunner.query(`ALTER TABLE \`project\` DROP COLUMN \`mode\``);
    await queryRunner.query(
      `ALTER TABLE \`project\` ADD \`mode\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE \`project\` DROP COLUMN \`id\``);
    await queryRunner.query(
      `ALTER TABLE \`project\` ADD \`id\` int NOT NULL AUTO_INCREMENT`,
    );
    await queryRunner.query(`ALTER TABLE \`project\` ADD PRIMARY KEY (\`id\`)`);
    await queryRunner.query(
      `ALTER TABLE \`project\` CHANGE \`id\` \`id\` int NOT NULL AUTO_INCREMENT`,
    );
    await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`id\``);
    await queryRunner.query(
      `ALTER TABLE \`users\` ADD \`id\` int NOT NULL AUTO_INCREMENT`,
    );
    await queryRunner.query(`ALTER TABLE \`users\` ADD PRIMARY KEY (\`id\`)`);
    await queryRunner.query(
      `ALTER TABLE \`users\` CHANGE \`id\` \`id\` int NOT NULL AUTO_INCREMENT`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_roles\` ADD CONSTRAINT \`FK_87b8888186ca9769c960e926870\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(`ALTER TABLE \`project\` DROP COLUMN \`chain_id\``);
    await queryRunner.query(
      `ALTER TABLE \`project\` DROP COLUMN \`refresh_token\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`project\` DROP COLUMN \`access_token\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`project\` DROP COLUMN \`description\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`project\` ADD \`api_key\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_758d07e24268bb68acfc2ba8d3\` ON \`access\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_2d29a8162ec942b00d044d8e17\` ON \`access\``,
    );
    await queryRunner.query(`DROP TABLE \`access\``);
  }
}
