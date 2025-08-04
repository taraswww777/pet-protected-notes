import axios from 'axios';
import { getMockNoteDTO, getMockNoteDTOList } from './mocks/mockNoteDTO.ts';

const axiosInstance = axios.create({
  baseURL: '',
});

const IS_NEED_MOCK = false;

if (IS_NEED_MOCK) {
  axiosInstance.interceptors.response.use(async (response) => {
    // Пропускаем все запросы, не соответствующие маске
    if (!response.config.url?.includes('/api/notes')) {
      return response;
    }

    const urlParts = response.config.url.split('/');
    const noteId = urlParts[urlParts.length - 1] || urlParts[urlParts.length - 2];
    const method = response.config.method?.toLowerCase();

    // Имитация задержки сети
    await new Promise(resolve => setTimeout(resolve, 150));

    // Обработка разных методов
    switch (method) {
      case 'get':
        if (noteId) {
          // GET /api/notes/:id
          return {
            ...response,
            data: getMockNoteDTO(+noteId),
            status: 200,
            statusText: 'OK',
          };
        } else {
          // GET /api/notes
          return {
            ...response,
            data: { items: getMockNoteDTOList(10) },
            status: 200,
            statusText: 'OK',
          };
        }
      default:
        return response;
    }
  });
}

export { axiosInstance };
