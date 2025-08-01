import { FastifyInstance } from 'fastify';
import { NotesController } from './notes.controller';
import { NotesService } from './notes.service';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { middlewareVerifyJWT } from '../../middleware/middlewareVerifyJWT';
import { noteCreateSchema, noteIdSchema, noteListSchema, notePaginationSchema, noteUpdateSchema } from './notes.schema';
import { RouteWithPagination } from '../../types/zodSchemas/paginationZodSchema.js';

export async function notesRoutes(server: FastifyInstance) {
  // Добавляем middlewareVerifyJWT ко всем маршрутам
  server.addHook('preHandler', middlewareVerifyJWT);

  const notesController = new NotesController(new NotesService());

  server.withTypeProvider<ZodTypeProvider>().get('/', {
    schema: {
      querystring: notePaginationSchema,
      response: noteListSchema
    },
  }, (req) => notesController.getAll(req));
  // server.get<{
  //   Params: WithId;
  //   Body: Partial<CreateNoteBody>
  // }>('/:id', {
  //   schema: {
  //     params: noteIdSchema,
  //   },
  // }, (req, reply) => notesController.getById(req, reply));
  // server.post<RequestWithBody<CreateNoteBody>>('/', {
  //   schema: {
  //     body: noteCreateSchema,
  //   },
  // }, (req) => notesController.create(req));
  // server.put<{
  //   Params: WithId;
  //   Body: Partial<CreateNoteBody>
  // }>('/:id', {
  //     schema: {
  //       params: noteIdSchema,
  //       body: noteUpdateSchema,
  //     },
  //   },
  //   (req, reply) => notesController.update(req, reply));
  // server.delete<{ Params: WithId }>('/:id', {
  //   schema: {
  //     params: noteIdSchema,
  //   },
  // }, (req, reply) => notesController.delete(req, reply));
}
