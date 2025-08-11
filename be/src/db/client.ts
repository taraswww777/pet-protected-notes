import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schemas';
import '../includeEnv';

if (!process.env.POSTGRES_CONNECTION) {
  throw new Error('empty process.env.POSTGRES_CONNECTION');
}

const pgClient = new Pool({
  connectionString: process.env.POSTGRES_CONNECTION,
});

export const db = drizzle(pgClient, { schema });
