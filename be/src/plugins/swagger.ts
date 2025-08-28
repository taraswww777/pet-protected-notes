import { FastifyInstance } from 'fastify';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import {
  fastifyZodOpenApiTransform,
  fastifyZodOpenApiTransformObject
} from 'fastify-zod-openapi';

export async function swaggerPlugin(server: FastifyInstance) {
  await server.register(fastifySwagger, {
    openapi: {
      info: {
        title: 'Protected Notes API',
        description: 'API documentation for Protected Notes application',
        version: '0.1.0'
      },
      servers: [
        {
          url: 'http://localhost:8080',
          description: 'Development server'
        }
      ]
    },
    transform: fastifyZodOpenApiTransform,
    transformObject: fastifyZodOpenApiTransformObject
  });

  await server.register(fastifySwaggerUi, {
    routePrefix: '/documentation'
  });
}
