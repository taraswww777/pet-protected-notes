import { FastifyInstance } from 'fastify';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

import { RequestWithBody } from '../../types/common';
import { schema } from '../../db';
import { loginSchema, registerSchema } from './auth.schema';

export async function authRoutes(server: FastifyInstance) {
  const authController = new AuthController(new AuthService());

  server.post<RequestWithBody<schema.LoginUserBody>>(
    '/login',
    {
      schema: {
        body: loginSchema,
      },
    },
    (req, reply) => authController.login(req, reply)
  );
  server.post<RequestWithBody<schema.LoginUserBody>>(
    '/register',
    { schema: { body: registerSchema } },
    (req, reply) => authController.register(req, reply));
}
