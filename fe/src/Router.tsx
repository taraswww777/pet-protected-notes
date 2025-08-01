import { Route, Routes } from 'react-router';
import { Suspense } from 'react';
import {
  HomePage,
  NoteCreatePage,
  NoteEditPage,
  NotesListPage,
  NoteViewPage,
  NotFoundPage,
} from './pages';
import { ErrorBoundary } from 'react-error-boundary';
import { Loader } from './uiKit/Loader.tsx';
import { ErrorFallback } from './components/ErrorFallback.tsx';
import {
  LoginPage, PasswordResetPage, RegisterPage, TwoFAPage, UserPage,
} from './modules/auth';


export const Router = () => {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Suspense fallback={<Loader />}>
        <Routes>
          {/* Основные страницы */}
          <Route index element={<HomePage />} />

          {/* Auth страницы */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/user" element={<UserPage />} />

          {/* Auth Опциональные страницы */}
          <Route path="/password-reset" element={<PasswordResetPage />} />
          <Route path="/two-factor-auth" element={<TwoFAPage />} />

          {/* Notes страницы */}
          <Route path="/notes/create" element={<NoteCreatePage />} />
          <Route path="/notes/:id/edit" element={<NoteEditPage />} />
          <Route path="/notes/:id" element={<NoteViewPage />} />
          <Route path="/notes" element={<NotesListPage />} />

          {/* Запасной маршрут (404) */}
          <Route path="*" element={<NotFoundPage />} />

        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
};
