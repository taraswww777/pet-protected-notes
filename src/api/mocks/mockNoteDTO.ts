import { NoteDTO } from '../types/noteDTO';

export const getMockNoteDTO = (id: string): NoteDTO => ({
  id,
  title: 'Тестовая заметка',
  content: 'Содержимое тестовой заметки',
});
