import { FastifyReply, FastifyRequest } from 'fastify';
import { RoleService } from './role.service';
import { getCurrentUserId } from '../auth';

export function checkPermission(actionCode: string) {
  return async (_request: FastifyRequest, reply: FastifyReply) => {
    const userId = getCurrentUserId();
    if (!userId) {
      return reply.code(401).send({ error: 'Unauthorized' });
    }

    const roleService = new RoleService();
    const hasAccess = await roleService.checkPermission({
      userId,
      actionCode
    });

    if (!hasAccess) {
      return reply.code(403).send({ error: 'Forbidden' });
    }
  };
}
