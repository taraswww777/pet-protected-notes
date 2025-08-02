import { lazy } from 'react';

export const HomePage = lazy(() => import('./HomePage'));
export const NotesListPage = lazy(() => import('./NotesListPage'));
export const NoteCreatePage = lazy(() => import('./NoteCreatePage'));
export const NoteEditPage = lazy(() => import('./NoteEditPage'));
export const NoteViewPage = lazy(() => import('./NoteViewPage'));
export const NotFoundPage = lazy(() => import('./NotFoundPage'));
