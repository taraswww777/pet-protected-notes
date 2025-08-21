import { FastifyReply, FastifyRequest } from 'fastify';
import { UserInfoService } from './userInfo.service';
import { getCurrentUserId } from '../auth';
import { schema } from '../../db';

export class UserInfoController {
  constructor(private readonly userInfoService: UserInfoService) {}

  async get(_request: FastifyRequest, _reply: FastifyReply) {
    const userId = getCurrentUserId();
    return await this.userInfoService.getByUserId(userId);
  }

  async update(
    request: FastifyRequest<{ Body: Partial<schema.UserInfoInsert> }>,
    _reply: FastifyReply
  ) {
    const userId = getCurrentUserId();
    return this.userInfoService.createOrUpdate(userId, request.body);
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
