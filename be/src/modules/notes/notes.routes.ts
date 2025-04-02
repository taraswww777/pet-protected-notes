import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { NotesService } from './notes.service';

interface NoteParams {
  id: string;
}

interface CreateNoteBody {
  title: string;
  content: string;
}

export async function notesRoutes(server: FastifyInstance) {
  // Получить все заметки
  server.get('/notes', async () => {
    return NotesService.getAll();
  });

  // Получить заметку по ID
  server.get('/notes/:id', async (
    request: FastifyRequest<{ Params: NoteParams }>,
    reply: FastifyReply
  ) => {
    const id = Number(request.params.id);
    const note = NotesService.getById(id);

    if (!note) {
      reply.code(404).send({ error: 'Заметка не найдена' });
      return;
    }

    return note;
  });

  // Создать заметку
  server.post('/notes', async (
    request: FastifyRequest<{ Body: CreateNoteBody }>
  ) => {
    const data = request.body;
    return NotesService.create(data);
  });

  // Обновить заметку
  server.put('/notes/:id', async (
    request: FastifyRequest<{ Params: NoteParams; Body: Partial<CreateNoteBody> }>,
    reply: FastifyReply
  ) => {
    const id = Number(request.params.id);
    const data = request.body;

    const updatedNote = NotesService.update(id, data);
    if (!updatedNote) {
      reply.code(404).send({ error: 'Заметка не найдена' });
      return;
    }

    return updatedNote;
  });

  // Удалить заметку
  server.delete('/notes/:id', async (
    request: FastifyRequest<{ Params: NoteParams }>,
    reply: FastifyReply
  ) => {
    const id = Number(request.params.id);

    const success = NotesService.delete(id);
    if (!success) {
      reply.code(404).send({ error: 'Заметка не найдена' });
      return;
    }

    reply.code(204).send();
  });
}
