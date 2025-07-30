import { JwtPayload } from 'jsonwebtoken';

declare module 'fastify' {
  interface FastifyRequest {
    user?: string | JwtPayload | { userId: string }; // Тип для request.user
  }
}
