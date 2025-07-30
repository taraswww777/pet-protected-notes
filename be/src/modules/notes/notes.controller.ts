import { FastifyReply, FastifyRequest } from 'fastify';
import { NotesService } from './notes.service';

import { PaginationParams, RequestWithBody, WithId } from '../../types/common';
import { CreateNoteBody } from './notes.types';

export class NotesController {
  constructor(private readonly notesService: NotesService) {
  }

  async getAll(request: FastifyRequest<{ Querystring: PaginationParams }>) {
    const page = request.query.page ? +request.query.page : undefined;
    const limit = request.query.limit ? +request.query.limit : undefined;

    return this.notesService.getAll({ page, limit });
  }

  async getById(
    request: FastifyRequest<{ Params: WithId }>,
    reply: FastifyReply,
  ) {
    const id = Number(request.params.id);
    const note = await this.notesService.getById(id);

    if (!note) {
      return reply.code(404).send({ error: 'Заметка не найдена' });
    }

    return note;
  }

  async create(request: FastifyRequest<RequestWithBody<CreateNoteBody>>) {
    const data = request.body;
    return this.notesService.create(data);
  }

  async update(
    request: FastifyRequest<{ Params: WithId; Body: Partial<CreateNoteBody> }>,
    reply: FastifyReply,
  ) {
    const id = Number(request.params.id);
    const data = request.body;

    const updatedNote = await this.notesService.update(id, data);
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

    const success = await this.notesService.delete(id);
    if (!success) {
      return reply.code(404).send({ error: 'Заметка не найдена' });
    }

    return reply.code(204).send();
  }
}
