import { NoteDTO } from './types/noteDTO';
import { axiosInstance } from './asiosInstanse.ts';
import { PaginatedResponse, PaginationParams } from 'protected-notes-be/src/types/common.ts';
import { PAGE_SIZE_DEFAULT } from '../constants/common.ts';
import { AxiosResponse } from 'axios';


export class NotesServiceApi {
  static async getNoteById(id: string) {
    return axiosInstance
      .get<undefined, AxiosResponse<NoteDTO>>(`/api/notes/${id}`)
      .then(({ data }) => data);
  }

  static async getNotesList({
    limit = PAGE_SIZE_DEFAULT,
    page = 1,
  }: PaginationParams) {
    return axiosInstance
      .get<PaginationParams, AxiosResponse<PaginatedResponse<NoteDTO>>>(`/api/notes`, {
        params: {
          limit,
          page,
        },
      })
      .then(({ data }) => data);
  }

  static async updateNote(
    id: string,
    data: Omit<NoteDTO, 'id'>,
  ) {
    return axiosInstance
      .put<Omit<NoteDTO, 'id'>, AxiosResponse<NoteDTO>>(`/api/notes/${id}`, data)
      .then(({ data }) => data);
  }

  static async createNote(
    data: Omit<NoteDTO, 'id'>,
  ) {
    return axiosInstance.post<Omit<NoteDTO, 'id'>, AxiosResponse<NoteDTO>>(`/api/notes`, data).then(({ data }) => data);
  }
}
