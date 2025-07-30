import { FastifyInstance } from 'fastify';
import { NotesController } from './notes.controller';
import { NotesService } from './notes.service';

import { RequestWithBody, RouteWithPagination, WithId } from '../../types';
import { CreateNoteBody } from './notes.types';

export async function notesRoutes(server: FastifyInstance) {
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
