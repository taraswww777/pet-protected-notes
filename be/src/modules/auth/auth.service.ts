import { db, schema } from '../../db';
import jwt from 'jsonwebtoken';
import { eq } from 'drizzle-orm';
import bcrypt, { getRounds } from 'bcrypt';
import { InvalidCredentialsError } from '../../errors';
import { JWT_SECRET } from '../../constants';
import { UserDTO } from '../../db/schemas';

export class AuthService {
  async login(data: schema.LoginUserBody): Promise<schema.LoginUserSuccessResponse> {

    // 1. Находим пользователя
    const [user] = await db.select()
      .from(schema.users)
      .where(eq(schema.users.login, data.login))
      .limit(1)
      .execute();

    if (!user) {
      throw new InvalidCredentialsError('User not found');
    }

    // 2. Проверяем пароль
    const isPasswordValid = await bcrypt.compare(data.password, user.password);

    if (!isPasswordValid) {
      throw new InvalidCredentialsError('Invalid password');
    }

    // 3. Генерируем JWT-токен
    const token = jwt.sign(
      { userId: user.id }, // Payload
      JWT_SECRET!, // Секретный ключ из .env
      { expiresIn: '1w' }, // Время жизни токена
    );


    return { token, id: user.id };
  }

  async register(data: schema.RegisterUserBody): Promise<boolean> {
    const existingUser = await db.select().from(schema.users).where(eq(schema.users.login, data.login)).limit(1).execute();

    if (existingUser.length) {
      return false;
    }

    const salt = await bcrypt.genSalt();

    const hashedPassword = await bcrypt.hash(data.password, salt);

    await db.insert(schema.users).values({
      login: data.login,
      password: hashedPassword,
    }).returning().execute();

    return true;
  }


  async userInfo(userId: number): Promise<UserDTO> {
    const [user] = await db
      .select({
        id: schema.users.id,
        login: schema.users.login,
      })
      .from(schema.users)
      .where(eq(schema.users.id, userId))
      .limit(1)
      .execute();

    return user;
  }

  // В auth.service.ts добавить:
  async changePassword(
    userId: number,
    oldPassword: string,
    newPassword: string,
  ): Promise<boolean> {
    // 1. Получаем текущего пользователя
    const [user] = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.id, userId))
      .limit(1)
      .execute();

    if (!user) {
      throw new InvalidCredentialsError('Пользователь не найден');
    }

    // 2. Проверяем старый пароль
    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordValid) {
      throw new InvalidCredentialsError('Неверный текущий пароль');
    }

    // 3. Хешируем новый пароль
    const hashedPassword = await bcrypt.hash(newPassword, await bcrypt.genSalt());

    // 4. Обновляем пароль
    await db
      .update(schema.users)
      .set({ password: hashedPassword })
      .where(eq(schema.users.id, userId))
      .execute();

    return true;
  }
}
