import { FastifyReply, FastifyRequest } from 'fastify';
import { AuthService } from './auth.service';
import { RequestWithBody } from '../../types/common';
import { schema } from '../../db';
import { InvalidCredentialsError } from '../../errors';

export class AuthController {
  constructor(private readonly authService: AuthService) {
  }


  async login(request: FastifyRequest<RequestWithBody<schema.LoginUserBody>>, reply: FastifyReply) {
    const data = request.body;
    try {
      const user = await this.authService.login(data);
      if (!user) {
        return reply.code(401).send({ error: 'Неверные учетные данные' });
      }
      return reply.send(user);
    } catch (error) {
      return reply.code(500).send({ error: 'Ошибка сервера' });
    }
  }

  async register(request: FastifyRequest<RequestWithBody<schema.RegisterUserBody>>, reply: FastifyReply) {
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
      // Получаем userId из верифицированного JWT (middlewareVerifyJWT уже добавил его в request)
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

  // В auth.controller.ts добавить:
  async changePassword(
    request: FastifyRequest<RequestWithBody<schema.ChangePasswordBody>>,
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

}
