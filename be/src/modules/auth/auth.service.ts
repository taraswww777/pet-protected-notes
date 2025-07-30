import { db, schema } from '../../db';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcrypt';


export class AuthService {
  async login(data: schema.LoginUserBody): Promise<boolean> {
    const user = await db.select().from(schema.users).where(eq(schema.users.login, data.login)).limit(1).execute();

    if (!user.length) {
      return false;
    }

    return await bcrypt.compare(data.password, user[0].password);
  }
}
