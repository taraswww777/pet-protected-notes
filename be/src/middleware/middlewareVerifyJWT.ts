import { FastifyReply, FastifyRequest } from 'fastify';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../constants';

export async function middlewareVerifyJWT(request: FastifyRequest, reply: FastifyReply) {
  const token = request.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    return reply.status(401).send({ error: 'Token not provided' });
  }

  try {
    request.user = jwt.verify(token, JWT_SECRET); // Добавляем данные пользователя в запрос
  } catch (error) {
    return reply.status(401).send({ error: 'Invalid or expired token' });
  }
}
