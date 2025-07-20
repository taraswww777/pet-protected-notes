import type { Config } from 'drizzle-kit';

const dbUser = 'notes_user';
const dbPassword = 'secure_password';
const dbName = 'notes_db';


const dbConfig: Config = {
  schema: './src/db/schema.ts',
  out: './migrations',
  dialect: 'postgresql',
  driver: 'pg',
  dbCredentials: {
    host: 'localhost',
    port: 5432,
    user: dbUser,
    password: dbPassword,
    database: dbName,
  },
};

export default dbConfig;
