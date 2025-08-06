import { db, schema } from '../../db';
import jwt from 'jsonwebtoken';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcrypt';
import { InvalidCredentialsError } from '../../errors';
import { JWT_SECRET } from '../../constants';
import { ResetPasswordBody, UserDTO } from '../../db/schemas';
import { randomInt } from 'crypto';
import { hashingPassword } from './auth.utils';
import { TokenInfo } from './auth.types'; // Добавьте эту строку

export class AuthService {
  private resetCodes = new Map<string, { code: string; expiresAt: Date }>();

  async login(data: schema.LoginUserBody): Promise<undefined | schema.LoginUserSuccessResponse> {

    // 1. Находим пользователя
    const [user] = await db.select()
      .from(schema.users)
      .where(eq(schema.users.login, data.login))
      .limit(1)
      .execute();

    if (!user) {
      return undefined;
    }

    // 2. Проверяем пароль
    const isPasswordValid = await bcrypt.compare(data.password, user.password);

    if (!isPasswordValid) {
      return undefined;
    }

    const tokenInfo: TokenInfo = { userId: user.id }

    // 3. Генерируем JWT-токен
    const token = jwt.sign(
      tokenInfo,
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

    const hashedPassword = await hashingPassword(data.password);

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

  async initiatePasswordReset(login: string): Promise<boolean> {
    const [user] = await db.select()
      .from(schema.users)
      .where(eq(schema.users.login, login))
      .limit(1)
      .execute();

    if (!user) return true; // Возвращаем true даже если пользователя нет, чтобы не раскрывать информацию

    // Генерируем 6-значный код
    const resetCode = randomInt(100000, 999999).toString();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 минут

    this.resetCodes.set(login, { code: resetCode, expiresAt });

    // В реальном приложении здесь должна быть отправка email
    console.log(`Reset code for ${login}: ${resetCode}`); // Для разработки

    return true;
  }

  async completePasswordReset(data: ResetPasswordBody): Promise<boolean> {
    const resetData = this.resetCodes.get(data.login);

    // Проверяем код и время его жизни
    if (!resetData || resetData.code !== data.resetCode || resetData.expiresAt < new Date()) {
      return false;
    }

    // Хешируем новый пароль
    const hashedPassword = await bcrypt.hash(data.newPassword, await bcrypt.genSalt());

    // Обновляем пароль
    await db.update(schema.users)
      .set({ password: hashedPassword })
      .where(eq(schema.users.login, data.login))
      .execute();

    // Удаляем использованный код
    this.resetCodes.delete(data.login);

    return true;
  }

}
