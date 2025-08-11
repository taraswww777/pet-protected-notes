import { FastifyInstance, FastifyRequest } from 'fastify';
import { UserInfoController } from './userInfo.controller';
import { UserInfoService } from './userInfo.service';
import { middlewareVerifyJWT } from '../auth';
import { schema } from '../../db';
import { RequestWithBody } from '../../types/common';

export async function userInfoRoutes(server: FastifyInstance) {
  server.addHook('preHandler', middlewareVerifyJWT);

  const userInfoController = new UserInfoController(new UserInfoService());

  server.get('/', (req, reply) => userInfoController.get(req, reply));
  server.put('/', (req: FastifyRequest<RequestWithBody<Partial<schema.UserInfoInsert>>>, reply) => userInfoController.update(req, reply));
  server.delete('/', (req, reply) => userInfoController.delete(req, reply));
}
