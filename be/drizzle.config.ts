import type { Config } from 'drizzle-kit';

const dbUser = 'notes_user';
const dbPassword = 'secure_password';
const dbName = 'notes_db';


const dbConfig: Config = {
  schema: './src/db/schema.ts',
  out: './migrations',
  dialect: 'postgresql',
  driver: 'pglite',
  dbCredentials: {
    url: './.dbShema',
  },
};

export default dbConfig;
