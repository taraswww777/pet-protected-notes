import { FastifyReply, FastifyRequest } from 'fastify';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../../constants';
import { TokenInfo } from './auth.types';
import { isTokenInfo } from './index';

let tokenInfo: TokenInfo = {} as TokenInfo;

/**
 * Проверяет JWT токен из заголовков запроса.
 *
 * Если токен отсутствует или недействителен, отправляет ошибку 401.
 * В случае успешной проверки добавляет данные пользователя в объект запроса.
 */
export async function middlewareVerifyJWT(request: FastifyRequest, reply: FastifyReply) {
  const token = request.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    return reply.status(401).send({ error: 'Token not provided' });
  }

  try {
    const rawTokenInfo = jwt.verify(token, JWT_SECRET);

    if (isTokenInfo(rawTokenInfo)) {
      // Добавляем данные пользователя в запрос
      tokenInfo = rawTokenInfo;
      request.user = rawTokenInfo;
    } else {
      return reply.status(401).send({ error: 'Token is not valid' });
    }
  } catch (error) {
    return reply.status(401).send({ error: 'Invalid or expired token' });
  }
}

/**
 * Получаем userId из верифицированного JWT
 */
export const getCurrentUserId = () => {
  return tokenInfo?.userId;
}
