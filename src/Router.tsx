import { Route, Routes } from 'react-router';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { NoteCreatePage } from './pages/NoteCreatePage';
import { NoteEditPage } from './pages/NoteEditPage';
import { NoteViewPage } from './pages/NoteViewPage';
import { PasswordResetPage } from './pages/PasswordResetPage';
import { TwoFAPage } from './pages/TwoFAPage';
import { SettingsPage } from './pages/SettingsPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { NotesListPage } from './pages/NotesListPage';

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
