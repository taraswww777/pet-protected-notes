import type { Config } from 'drizzle-kit';
import * as path from 'node:path';
import { config } from 'dotenv';

const pathMigrations = './src/db/migrations';
// const pathMigrations = path.resolve(__dirname, './src/db/migrations');

config({
  path: path.relative(__dirname, '../.env'),
})

const dbConfig: Config = {
  schema: './src/db/schemas/*',
  out: pathMigrations,
  strict: true,
  verbose: true,
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.POSTGRES_CONNECTION || '',
  },
};

export default dbConfig;
