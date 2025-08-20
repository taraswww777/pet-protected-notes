import { FastifyInstance } from 'fastify';
import { NotesController } from './notes.controller';
import { NotesService } from './notes.service';

import { RequestWithBody,  WithId } from '../../types/common';
import { CreateNoteBody } from './notes.types';
import { middlewareVerifyJWT } from '../auth';
import { RouteWithPagination } from 'protected-notes-common/src/types/Paginate';

export async function notesRoutes(server: FastifyInstance) {
  // Добавляем middlewareVerifyJWT ко всем маршрутам
  server.addHook('preHandler', middlewareVerifyJWT);

  const notesController = new NotesController(new NotesService());

  server.get<RouteWithPagination>('/', (req) => notesController.getAll(req));

  server.get<{
    Params: WithId;
    Body: Partial<CreateNoteBody>
  }>('/:id', (req, reply) => notesController.getById(req, reply));

  server.post<RequestWithBody<CreateNoteBody>>('/', (req) => notesController.create(req));

  server.put<{
    Params: WithId;
    Body: Partial<CreateNoteBody>
  }>('/:id', (req, reply) => notesController.update(req, reply));

  server.delete<{ Params: WithId }>('/:id', (req, reply) => notesController.delete(req, reply));
}
