import { FastifyInstance } from 'fastify';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

import { RequestWithBody } from '../../types/common';
import { schema } from '../../db';
import { middlewareVerifyJWT } from '../../middleware/middlewareVerifyJWT';

export async function authRoutes(server: FastifyInstance) {
  const authController = new AuthController(new AuthService());

  server.post<RequestWithBody<schema.LoginUserBody>>('/login', (req, reply) => authController.login(req, reply));
  server.post<RequestWithBody<schema.LoginUserBody>>('/register', (req, reply) => authController.register(req, reply));

  server.get('/current-user-info',
    { preHandler: middlewareVerifyJWT },
    (req, reply) => authController.currentUserInfo(req, reply),
  );

}
