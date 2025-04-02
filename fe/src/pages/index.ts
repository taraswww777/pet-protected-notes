import { lazy } from 'react';

export const HomePage = lazy(() => import('./HomePage'));
export const LoginPage = lazy(() => import('./LoginPage'));
export const RegisterPage = lazy(() => import('./RegisterPage'));
export const NotesListPage = lazy(() => import('./NotesListPage'));
export const NoteCreatePage = lazy(() => import('./NoteCreatePage'));
export const NoteEditPage = lazy(() => import('./NoteEditPage'));
export const NoteViewPage = lazy(() => import('./NoteViewPage'));
export const NotFoundPage = lazy(() => import('./NotFoundPage'));
export const PasswordResetPage = lazy(() => import('./PasswordResetPage'));
export const SettingsPage = lazy(() => import('./SettingsPage'));
export const TwoFAPage = lazy(() => import('./TwoFAPage'));
