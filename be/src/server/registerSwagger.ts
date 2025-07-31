import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import type { FastifyInstance } from 'fastify/types/instance';


// Конфигурация Swagger
export function registerFastifySwagger(server: FastifyInstance) {
  server.register(fastifySwagger, {
    openapi: {
      info: {
        title: 'Protected Notes API',
        description: 'API для работы с защищёнными заметками',
        version: '0.1.0',
      },
      servers: [
        { url: 'http://localhost:8080', description: 'Development server' },
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
      },
    },
  });

  // Swagger UI (веб-интерфейс)
  server.register(fastifySwaggerUi, {
    routePrefix: '/swagger',
    uiConfig: {
      docExpansion: 'list',
      deepLinking: true,
    },
  });
}

