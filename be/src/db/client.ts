// src/db/client.ts
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

const dbUser = 'notes_user';
const dbPassword = 'secure_password';
const dbName = 'notes_db';

const pool = new Pool({
  connectionString: `postgres://${dbUser}:${dbPassword}@localhost:5432/${dbName}`,
});

export const db = drizzle(pool, { schema });
