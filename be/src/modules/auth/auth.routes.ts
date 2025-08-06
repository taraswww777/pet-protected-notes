import { FastifyInstance } from 'fastify';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { middlewareVerifyJWT } from '../../middleware/middlewareVerifyJWT';
import {
  ChangePasswordBody, ChangePasswordSchema,
  ForgotPasswordBody, ForgotPasswordSchema,
  LoginUserBody, LoginUserFastifySchema,
  LoginUserSchema, RegisterUserBody, RegisterUserSchema,
  ResetPasswordBody, ResetPasswordSchema,
} from '../../db/zod/users.zod';

export async function authRoutes(server: FastifyInstance) {
  const authController = new AuthController(new AuthService());

  server.post<{ Body: LoginUserBody }>('/login', {
    schema: { body: LoginUserFastifySchema },
    handler: (req, reply) => authController.login(req, reply),
  });

  server.post<{ Body: RegisterUserBody }>('/register', {
    schema: { body: RegisterUserSchema },
    handler: (req, reply) => authController.register(req, reply),
  });

  // Аналогично для остальных роутов:
  server.put<{ Body: ChangePasswordBody }>('/change-password', {
    schema: { body: ChangePasswordSchema },
    preHandler: middlewareVerifyJWT,
    handler: (req, reply) => authController.changePassword(req, reply),
  });

  server.post<{ Body: ForgotPasswordBody }>('/forgot-password', {
    schema: { body: ForgotPasswordSchema },
    handler: (req, reply) => authController.forgotPassword(req, reply),
  });

  server.post<{ Body: ResetPasswordBody }>('/reset-password', {
    schema: { body: ResetPasswordSchema },
    handler: (req, reply) => authController.resetPassword(req, reply),
  });

  server.get('/current-user-info',
    { preHandler: middlewareVerifyJWT },
    (req, reply) => authController.currentUserInfo(req, reply),
  );
}
