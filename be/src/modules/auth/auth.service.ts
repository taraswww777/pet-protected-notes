import { db, schema } from '../../db';
import jwt from 'jsonwebtoken';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcrypt';
import { InvalidCredentialsError } from '../../errors';
import { JWT_SECRET } from '../../constants';
import { ResetPasswordBody, UserSelect } from '../../db/schemas';
import { randomInt } from 'crypto';
import { hashingPassword } from './auth.utils';
import { TokenInfo } from './auth.types';
import { FastifyRequest } from 'fastify';
import { BaseService } from '../../utils/BaseService';

export class AuthService extends BaseService {
  private resetCodes = new Map<string, { code: string; expiresAt: Date }>();

  constructor() {
    super();

    this.serviceName = 'AuthService';
  }

  async login(data: schema.LoginUserBody, request?: FastifyRequest): Promise<undefined | schema.LoginUserSuccessResponse> {

    // 1. Находим пользователя
    const [user] = await db.select()
      .from(schema.users)
      .where(eq(schema.users.login, data.login))
      .limit(1)
      .execute();

    if (!user) {
      void this.logError('login', {
        login: data.login,
        message: 'Пользователь не найден',
      }, request);

      return undefined;
    }

    // 2. Проверяем пароль
    const isPasswordValid = await bcrypt.compare(data.password, user.password);

    if (!isPasswordValid) {
      void this.logError('login', {
        login: data.login,
        message: 'Неверный пароль',
      }, request);

      return undefined;
    }

    const tokenInfo: TokenInfo = { userId: user.id };

    // 3. Генерируем JWT-токен
    const token = jwt.sign(
      tokenInfo,
      JWT_SECRET!, // Секретный ключ из .env
      { expiresIn: '1w' }, // Время жизни токена
    );

    void this.logSuccess('login', {
      login: data.login,
      message: 'Пользователь успешно авторизовался',
    }, request);

    return { token, id: user.id };
  }

  async register(data: schema.RegisterUserBody, request?: FastifyRequest): Promise<boolean> {
    const existingUser = await db.select().from(schema.users).where(eq(schema.users.login, data.login)).limit(1).execute();

    if (existingUser.length) {
      void this.logError('register', {
        login: data.login,
        message: 'Пользователь с таким email уже существует',
      }, request);

      return false;
    }

    const hashedPassword = await hashingPassword(data.password);

    await db.insert(schema.users).values({
      login: data.login,
      password: hashedPassword,
    }).returning().execute();

    void this.logSuccess('register', {
      login: data.login,
      message: 'Пользователь успешно зарегистрирован',
    }, request);

    return true;
  }


  async userInfo(userId: number, request?: FastifyRequest): Promise<UserSelect> {
    const [user] = await db
      .select({
        id: schema.users.id,
        login: schema.users.login,
      })
      .from(schema.users)
      .where(eq(schema.users.id, userId))
      .limit(1)
      .execute();

    void this.logInfo('userInfo', {
      message: `Запрошена информация о пользователе userId: ${userId}. Предоставлена информация ${JSON.stringify(user)}`,
    }, request);

    return user;
  }

  // В auth.service.ts добавить:
  async changePassword(
    userId: number,
    oldPassword: string,
    newPassword: string,
    _request?: FastifyRequest,
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

  async initiatePasswordReset(login: string, request?: FastifyRequest): Promise<boolean> {
    const [user] = await db.select()
      .from(schema.users)
      .where(eq(schema.users.login, login))
      .limit(1)
      .execute();

    void this.logInfo('initiatePasswordReset', {
      message: `Попытка смены пароля для ${JSON.stringify(login)}`,
    }, request);

    if (!user) return true; // Возвращаем true даже если пользователя нет, чтобы не раскрывать информацию

    // Генерируем 6-значный код
    const resetCode = randomInt(100000, 999999).toString();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 минут

    this.resetCodes.set(login, { code: resetCode, expiresAt });

    // В реальном приложении здесь должна быть отправка email
    console.log(`Reset code for ${login}: ${resetCode}`); // Для разработки

    void this.logInfo('initiatePasswordReset', {
      message: `Запущен процесс мены пароля для пользователя: ${JSON.stringify({ login, id: user.id })}`,
    }, request);

    return true;
  }

  async completePasswordReset(data: ResetPasswordBody, request?: FastifyRequest): Promise<boolean> {
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

    void this.logInfo('completePasswordReset', {
      message: `Пароль успешно обновлён: ${JSON.stringify({ login: data.login })}`,
    }, request);

    return true;
  }

}
