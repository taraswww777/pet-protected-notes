import { fastify } from 'fastify';
import { notesRoutes } from './modules/notes';
import { authRoutes } from './modules/auth';
import { systemLogRoutes } from './modules/systemLog';
import { userInfoRoutes } from './modules/userInfo';
import { roleRoutes } from './modules/role';
import fs from 'fs';
import path from 'path';

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

async function logRoutesToFile() {
  try {
    const routes = server.printRoutes();
    const logDir = path.join(process.cwd(), 'logs');

    // Создаем директорию logs если не существует
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }

    const logFile = path.join(logDir, 'routes.log');
    const timestamp = new Date().toISOString();
    fs.writeFileSync(logFile, `=== Server Routes - ${timestamp} ===\n\n${routes}\n`);
    console.log(`Routes logged to: ${logFile}`);
  } catch (error) {
    console.error('Failed to log routes:', error);
  }
}

server.listen({ port: 8080, host: '0.0.0.0' }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }

  console.log(`Server listening at ${address}`);

  // Логируем маршруты после старта сервера
  void logRoutesToFile();
});
