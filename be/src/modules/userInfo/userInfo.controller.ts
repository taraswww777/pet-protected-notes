import { FastifyReply, FastifyRequest } from 'fastify';
import { UserInfoService } from './userInfo.service';
import { getCurrentUserId } from '../auth';
import { z } from 'zod';
import { RequestWithBody } from '../../types/common';
import {
  UserInfoUpdateBody,
  userInfoUpdateValidationSchema,
} from './userInfo.validation.schema';

export class UserInfoController {
  constructor(private readonly userInfoService: UserInfoService) {}

  async get(_request: FastifyRequest, _reply: FastifyReply) {
    const userId = getCurrentUserId();
    return await this.userInfoService.getByUserId(userId);
  }

  async update(
    request: FastifyRequest<RequestWithBody<UserInfoUpdateBody>>,
    reply: FastifyReply
  ) {
    try {
      // Валидация входящих данных
      const validatedData = userInfoUpdateValidationSchema.parse(request.body);
      const userId = getCurrentUserId();

      return this.userInfoService.createOrUpdate(userId, validatedData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.code(400).send({
          error: 'Ошибка валидации',
          details: error.issues.map(issue => ({
            field: issue.path.join('.'),
            message: issue.message,
            code: issue.code
          }))
        });
      }

      // Для других ошибок
      throw error;
    }
  }

  async delete(_request: FastifyRequest, reply: FastifyReply) {
    const userId = getCurrentUserId();
    const success = await this.userInfoService.delete(userId);

    if (!success) {
      return reply.code(404).send({ error: 'Информация не найдена' });
    }

    return reply.code(204).send();
  }
}
