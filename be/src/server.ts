import { fastify } from 'fastify';
import { notesRoutes } from './modules/notes';
import { authRoutes } from './modules/auth';
import { systemLogRoutes } from './modules/systemLog';
import { userInfoRoutes } from './modules/userInfo';
import { roleRoutes } from './modules/role';

const server = fastify();

server.addHook('preValidation', (request, reply, done) => {
  if (request.query && typeof request.query === 'object') {
    for (const key in request.query) {
      if (key.endsWith('[]')) {
        const newKey = key.replace('[]', '');
        request.query[newKey] = Array.isArray(request.query[key])
          ? request.query[key]
          : [request.query[key]];
        delete request.query[key];
      }
    }
  }
  done();
});

server.register(notesRoutes, { prefix: 'api/notes' });
server.register(authRoutes, { prefix: 'api/auth' });
server.register(systemLogRoutes, { prefix: 'api/system-logs' });
server.register(userInfoRoutes, { prefix: 'api/user-info' });
server.register(roleRoutes, { prefix: 'api/roles' });

server.listen({ port: 8080, host: '0.0.0.0' }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
