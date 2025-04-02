import { NoteDTO } from './notes.types';
import { generateMockNotes } from './notes.mocks';

// Инициализация моковых данных
let notesService: NoteDTO[] = generateMockNotes();

// CRUD операции
export const NotesService = {
  // Получить все заметки
  getAll: () => notesService,

  // Получить заметку по id
  getById: (id: number) => notesService.find(note => note.id === id),

  // Создать новую заметку
  create: (data: Omit<NoteDTO, 'id' | 'createdAt'>) => {
    const newNote: NoteDTO = {
      id: notesService.length + 1,
      ...data,
      createdAt: new Date().toISOString()
    };
    notesService.push(newNote);
    return newNote;
  },

  // Обновить заметку
  update: (id: number, data: Partial<Omit<NoteDTO, 'id' | 'createdAt'>>) => {
    const index = notesService.findIndex(note => note.id === id);
    if (index === -1) return null;

    notesService[index] = {
      ...notesService[index],
      ...data
    };
    return notesService[index];
  },

  // Удалить заметку
  delete: (id: number) => {
    const index = notesService.findIndex(note => note.id === id);
    if (index === -1) return false;

    notesService = notesService.filter(note => note.id !== id);
    return true;
  }
};
