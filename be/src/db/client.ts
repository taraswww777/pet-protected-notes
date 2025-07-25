// src/db/client.ts
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schemas';
// import { config } from 'dotenv';
// import path from 'node:path';

// if (!process.env.POSTGRES_CONNECTION) {
//   throw new Error('empty process.env.POSTGRES_CONNECTION')
// }

const pool = new Pool({
  connectionString: 'postgres://notes_user:secure_password@localhost:5432/notes_db',
});

export const db = drizzle(pool, { schema });
