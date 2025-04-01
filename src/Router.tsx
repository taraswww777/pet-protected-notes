import { Route, Routes } from 'react-router';
import {
  HomePage,
  LoginPage,
  NoteCreatePage,
  NoteEditPage,
  NotesListPage,
  NoteViewPage,
  NotFoundPage,
  PasswordResetPage,
  RegisterPage,
  SettingsPage,
  TwoFAPage,
} from './pages';

export const Router = () => {
  return (
    <Routes>
      {/* Основные страницы */}
      <Route index element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/notes/create" element={<NoteCreatePage />} />
      <Route path="/notes/:id/edit" element={<NoteEditPage />} />
      <Route path="/notes/:id" element={<NoteViewPage />} />
      <Route path="/notes" element={<NotesListPage />} />

      {/* Опциональные страницы */}
      <Route path="/password-reset" element={<PasswordResetPage />} />
      <Route path="/two-factor-auth" element={<TwoFAPage />} />
      <Route path="/settings" element={<SettingsPage />} />

      {/* Запасной маршрут (404) */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};
