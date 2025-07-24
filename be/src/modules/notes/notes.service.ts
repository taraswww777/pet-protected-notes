// import { NoteDTO } from './notes.types';
import { generateMockNotes } from './notes.mocks';
import { PaginatedResponse, PaginationParams } from '../../types';
import { db, schema } from '../../db';
import { sql } from 'drizzle-orm';

// CRUD операции
// notes.service.ts
export class NotesService {
  // Инициализация моковых данных
  private mockedNotes: schema.NoteDTO[] = generateMockNotes();

  async getAll(
    params?: PaginationParams
  ): Promise<PaginatedResponse<schema.NoteDTO>> {
    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const offset = (page - 1) * limit;

    // Запрашиваем данные и общее количество записей ОДНИМ запросом (оптимизация)
    const [notes, total] = await Promise.all([
      db.select()
        .from(schema.notes)
        .limit(limit)
        .offset(offset)
        .execute(), // Явный execute() для четкости

      db.select({
        count: sql<number>`count(id)`
      })
        .from(schema.notes)
        .then((res) => res[0]?.count || 0)
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      items: notes.map((note) => ({
        id: note.id,
        title: note.title,
        content: note.content,
      })),
      total,
      currentPage: page,
      totalPages,
      hasNext: page < totalPages,
      hasPrevious: page > 1,
    };
  }

  getById(id: number) {
    return this.mockedNotes.find(note => note.id === id);
  }

  create(data: Omit<schema.NoteDTO, 'id' | 'createdAt'>) {
    const newNote: schema.NoteDTO = {
      id: this.mockedNotes.length + 1,
      ...data,
    };
    this.mockedNotes.push(newNote);
    return newNote;
  }

  update(id: number, data: Partial<Omit<schema.NoteDTO, 'id' | 'createdAt'>>) {
    const index = this.mockedNotes.findIndex(note => note.id === id);
    if (index === -1) return null;

    this.mockedNotes[index] = {
      ...this.mockedNotes[index],
      ...data,
    };
    return this.mockedNotes[index];
  }

  delete(id: number) {
    const index = this.mockedNotes.findIndex(note => note.id === id);
    if (index === -1) return false;

    this.mockedNotes = this.mockedNotes.filter(note => note.id !== id);
    return true;
  }
}
