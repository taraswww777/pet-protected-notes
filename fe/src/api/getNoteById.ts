import { NoteDTO } from './types/noteDTO';
import { getMockNoteDTO } from './mocks/mockNoteDTO';

/** Временная реализация для демонстрации */
export const getNoteById = async (id: string): Promise<NoteDTO> => {
  // Имитация задержки сети
  await new Promise((resolve) => setTimeout(resolve, 500));

  // В будущем здесь будет реальный API-запрос
  // return await fetch(`/api/notes/${id}`).then(res => res.json());

  // Возвращаем моковые данные
  return getMockNoteDTO(id);
};

export const updateNote = async (
  id: string,
  data: Omit<NoteDTO, 'id'>,
): Promise<NoteDTO> => {
  // Имитация задержки сети
  await new Promise((resolve) => setTimeout(resolve, 500));

  // В будущем здесь будет реальный API-запрос
  // return await fetch(`/api/notes/${id}`, {
  //   method: 'PUT',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(data)
  // }).then(res => res.json());

  // Возвращаем обновленные данные
  return {
    id,
    ...data,
  };
};
