import { NoteDTO } from './notes.types';
import { generateMockNotes } from './notes.mocks';
import { PaginatedResponse, PaginationParams } from '../../types';
import { db, schema } from '../../db';
import { sql } from 'drizzle-orm';

// CRUD операции
// notes.service.ts
export class NotesService {
  // Инициализация моковых данных
  private mockedNotes: NoteDTO[] = generateMockNotes();

  async getAll(params?: PaginationParams): Promise<PaginatedResponse<NoteDTO>> {
    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const startIndex = (page - 1) * limit;

    // Получаем данные из БД и сериализуем их
    const dbNotes = await db.select().from(schema.notes).limit(limit).offset(startIndex);
    const items = dbNotes.map(note => ({
      id: note.id,
      title: note.title,
      content: note.content,
      createdAt: note.createdAt.toISOString(),
      updatedAt: note.updatedAt?.toISOString() || null,
    }));

    // Для пагинации можно использовать реальное количество из БД
    const total = await db.select({ count: sql<number>`count(*)` }).from(schema.notes);
    const totalCount = total[0]?.count ?? 0;
    const totalPages = Math.ceil(totalCount / limit);

    return {
      items,
      total: totalCount,
      currentPage: page,
      totalPages,
      hasNext: page < totalPages,
      hasPrevious: page > 1,
    };
  }


  getById(id: number) {
    return this.mockedNotes.find(note => note.id === id);
  }

  create(data: Omit<NoteDTO, 'id' | 'createdAt'>) {
    const newNote: NoteDTO = {
      id: this.mockedNotes.length + 1,
      ...data,
      createdAt: new Date().toISOString(),
    };
    this.mockedNotes.push(newNote);
    return newNote;
  }

  update(id: number, data: Partial<Omit<NoteDTO, 'id' | 'createdAt'>>) {
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
