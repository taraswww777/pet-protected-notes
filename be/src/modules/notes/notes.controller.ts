import { FastifyReply, FastifyRequest } from 'fastify';
import { NotesService } from './notes.service';

import { PaginationParams, RequestWithBody, WithId } from '../../types/common';
import { CreateNoteBody } from './notes.types';
import { getCurrentUserId } from '../auth';

export class NotesController {
  constructor(private readonly notesService: NotesService) {
  }

  async getAll(request: FastifyRequest<{ Querystring: PaginationParams }>) {
    const page = request.query.page ? +request.query.page : undefined;
    const limit = request.query.limit ? +request.query.limit : undefined;
    const userId = getCurrentUserId();
    return this.notesService.getAll({ page, limit }, userId);
  }

  async getById(
    request: FastifyRequest<{ Params: WithId }>,
    reply: FastifyReply,
  ) {
    const id = Number(request.params.id);
    const userId = getCurrentUserId();
    const note = await this.notesService.getById(id, userId);

    if (!note) {
      return reply.code(404).send({ error: 'Заметка не найдена' });
    }

    return note;
  }

  async create(request: FastifyRequest<RequestWithBody<CreateNoteBody>>) {
    const data = request.body;
    const userId = getCurrentUserId();

    return this.notesService.create(data, userId);
  }

  async update(
    request: FastifyRequest<{ Params: WithId; Body: Partial<CreateNoteBody> }>,
    reply: FastifyReply,
  ) {
    const id = Number(request.params.id);
    const userId = getCurrentUserId();

    const updatedNote = await this.notesService.update(id, request.body, userId);

    if (!updatedNote) {
      return reply.code(404).send({ error: 'Заметка не найдена' });
    }

    return updatedNote;
  }

  async delete(
    request: FastifyRequest<{ Params: WithId }>,
    reply: FastifyReply,
  ) {
    const id = Number(request.params.id);

    const userId = getCurrentUserId();

    const success = await this.notesService.delete(id, userId);

    if (!success) {
      return reply.code(404).send({ error: 'Заметка не найдена' });
    }

    return reply.code(204).send();
  }
}
