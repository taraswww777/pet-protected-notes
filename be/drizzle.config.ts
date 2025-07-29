import type { Config } from 'drizzle-kit';
import './src/includeEnv';

const pathMigrations = './src/db/migrations';

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
