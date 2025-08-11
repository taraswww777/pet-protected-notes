import { fastify } from 'fastify';
import { notesRoutes } from './modules/notes';
import { authRoutes } from './modules/auth';
import { systemLogRoutes } from './modules/systemLog';

const server = fastify()

server.register(notesRoutes, { prefix: 'api/notes' });
server.register(authRoutes, { prefix: 'api/auth' });
server.register(systemLogRoutes, { prefix: 'api/system-logs' });

server.listen({ port: 8080, host: '0.0.0.0' }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
