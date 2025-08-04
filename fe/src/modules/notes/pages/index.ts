import { lazy } from 'react';

export const NotesListPage = lazy(() => import('./NotesListPage.tsx'));
export const NoteCreatePage = lazy(() => import('./NoteCreatePage.tsx'));
export const NoteEditPage = lazy(() => import('./NoteEditPage.tsx'));
export const NoteViewPage = lazy(() => import('./NoteViewPage.tsx'));
