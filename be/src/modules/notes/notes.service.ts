import { NoteDTO } from './notes.types';
import { generateMockNotes } from './notes.mocks';
import { PaginatedResponse, PaginationParams } from '../../types';

// CRUD операции
// notes.service.ts
export class NotesService {
  // Инициализация моковых данных
  private mockedNotes: NoteDTO[] = generateMockNotes();

  getAll(params?: PaginationParams): PaginatedResponse<NoteDTO> {
    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    const items = this.mockedNotes.slice(startIndex, endIndex);
    const total = this.mockedNotes.length;
    const totalPages = Math.ceil(total / limit);

    return {
      items,
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
