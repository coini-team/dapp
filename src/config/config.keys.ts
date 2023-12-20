/**
 * @description Enum for configuration keys
 * @enum {string}
 * @readonly
 */
export enum Configuration {
  PORT = 'PORT',
  DB_HOST = 'DB_HOST',
  DB_PORT = 'DB_PORT',
  DB_USERNAME = 'DB_USERNAME',
  DB_PASSWORD = 'DB_PASSWORD',
  DB_NAME = 'DB_NAME',
  DB_SSL = 'DB_SSL',
}

/**
 * @description Enum for jwt keys
 * @enum {string}
 * @readonly
 */
export enum JwtEnv {
  JWT_REFRESH_SECRET = 'JWT_REFRESH_SECRET',
  JWT_REFRESH_EXPIRES_IN = 'JWT_REFRESH_EXPIRES_IN',
}

/**
 * @description Enum for message keys
 * @enum {string}
 * @readonly
 */
export enum Message {
  MESSAGEBIRD_ACCESS_KEY = 'MESSAGEBIRD_ACCESS_KEY',
  MESSAGEBIRD_TIMEOUT = 'MESSAGEBIRD_TIMEOUT',
}

/**
 * @description Enum for blockchain keys
 * @enum {string}
 * @readonly
 */
export enum Blockchain {
  ERC20_FACTORY_ADDRESS = 'ERC20_FACTORY_ADDRESS',
  ERC721_FACTORY_ADDRESS = 'ERC721_FACTORY_ADDRESS',
  MUMBAI_TESTNET_URL = 'MUMBAI_TESTNET_URL',
  WALLET_PRIVATE_KEY = 'WALLET_PRIVATE_KEY',
}
