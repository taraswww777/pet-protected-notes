import { NoteDTO } from './types/noteDTO';
import { axiosInstance } from './asiosInstanse.ts';
import { PaginatedResponse } from 'protected-notes-be/src/types.ts';

export const getNoteById = async (id: string): Promise<NoteDTO> => {
  return axiosInstance.get(`/api/notes/${id}`).then(({ data }) => data);
};
export const getNotesList = async (): Promise<PaginatedResponse<NoteDTO>> => {
  return axiosInstance.get(`/api/notes`).then(({ data }) => data);
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
