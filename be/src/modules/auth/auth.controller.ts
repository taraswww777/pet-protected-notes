import { FastifyReply, FastifyRequest } from 'fastify';
import { AuthService } from './auth.service';
import {
  LoginUserBody,
  RegisterUserBody,
  ChangePasswordBody,
  ForgotPasswordBody,
  ResetPasswordBody,
} from '../../db/zod/users.zod';
import { InvalidCredentialsError } from '../../errors';

export class AuthController {
  constructor(private readonly authService: AuthService) {
  }

  async login(
    request: FastifyRequest<{ Body: LoginUserBody }>,
    reply: FastifyReply,
  ) {
    const data = request.body;
    try {
      const user = await this.authService.login(data);
      if (!user) {
        return reply.code(401).send({ error: 'Неверные учетные данные' });
      }
      return reply.send(user);
    } catch (error) {
      return reply.code(500).send({ error: 'Ошибка сервера:' + error });
    }
  }

  async register(
    request: FastifyRequest<{ Body: RegisterUserBody }>,
    reply: FastifyReply,
  ) {
    const data = request.body;
    try {
      const user = await this.authService.register(data);
      if (!user) {
        return reply.code(400).send({ error: 'Не удалось зарегистрировать пользователя' });
      }
      return reply.send(user);
    } catch (error) {
      return reply.code(500).send({ error: 'Ошибка сервера' });
    }
  }

  async currentUserInfo(request: FastifyRequest, reply: FastifyReply) {
    try {
      const userId = (request.user as { userId: number })?.userId;

      if (!userId) {
        return reply.code(401).send({ error: 'Не авторизован' });
      }

      const user = await this.authService.userInfo(userId);

      if (!user) {
        return reply.code(404).send({ error: 'Пользователь не найден' });
      }

      return reply.send(user);
    } catch (error) {
      return reply.code(500).send({ error: 'Ошибка сервера' });
    }
  }

  async changePassword(
    request: FastifyRequest<{ Body: ChangePasswordBody }>,
    reply: FastifyReply,
  ) {
    const userId = (request.user as { userId: number })?.userId;
    const { oldPassword, newPassword } = request.body;

    if (!userId) {
      return reply.code(401).send({ error: 'Не авторизован' });
    }

    try {
      const success = await this.authService.changePassword(userId, oldPassword, newPassword);
      if (!success) {
        return reply.code(400).send({ error: 'Не удалось изменить пароль' });
      }
      return reply.send({ success: true });
    } catch (error) {
      if (error instanceof InvalidCredentialsError) {
        return reply.code(401).send({ error: error.message });
      }
      return reply.code(500).send({ error: 'Ошибка сервера' });
    }
  }

  async forgotPassword(
    request: FastifyRequest<{ Body: ForgotPasswordBody }>,
    reply: FastifyReply,
  ) {
    try {
      const { login } = request.body;
      await this.authService.initiatePasswordReset(login);
      return reply.send({ success: true });
    } catch (error) {
      return reply.code(500).send({ error: 'Ошибка сервера' });
    }
  }

  async resetPassword(
    request: FastifyRequest<{ Body: ResetPasswordBody }>,
    reply: FastifyReply,
  ) {
    try {
      const success = await this.authService.completePasswordReset(request.body);
      if (!success) {
        return reply.code(400).send({ error: 'Неверный код или время его действия истекло' });
      }
      return reply.send({ success: true });
    } catch (error) {
      return reply.code(500).send({ error: 'Ошибка сервера' });
    }
  }
}
