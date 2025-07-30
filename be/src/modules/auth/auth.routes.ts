import { FastifyInstance } from 'fastify';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

import { RequestWithBody } from '../../types';
import { schema } from '../../db';

export async function authRoutes(server: FastifyInstance) {
  const authController = new AuthController(new AuthService());

  server.post<RequestWithBody<schema.LoginUserBody>>('/login', (req, reply) => authController.login(req, reply));
}
