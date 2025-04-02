import { fastify } from 'fastify';
import { notesRoutes } from './modules/notes';

const server = fastify();

// Регистрируем роуты для заметок
server.register(notesRoutes, { prefix: 'api' });

server.listen({ port: 8080, host: '0.0.0.0' }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
