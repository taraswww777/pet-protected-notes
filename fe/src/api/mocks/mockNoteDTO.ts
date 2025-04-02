import { NoteDTO } from '../types/noteDTO';

export const getMockNoteDTO = (id: string): NoteDTO => ({
  id,
  title: 'Тестовая заметка',
  content: 'Содержимое тестовой заметки',
});

export const getMockNoteDTOList = (count: number = 3): NoteDTO[] => {
  return Array.from({ length: count }, (_, index) =>
    getMockNoteDTO(`${index + 1}`),
  );
};
