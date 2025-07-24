// src/db/client.ts
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schemas';
import { config } from 'dotenv';
import path from 'node:path';

console.log('__dirname', __dirname)
console.log('path.relative(__dirname', path.resolve(__dirname, '../../../.env'))

config({
  path: path.resolve(__dirname, '../../../.env'),
})

if (!process.env.POSTGRES_CONNECTION) {
  throw new Error('empty process.env.POSTGRES_CONNECTION')
}

const pool = new Pool({
  connectionString: process.env.POSTGRES_CONNECTION,
});

export const db = drizzle(pool, { schema });
