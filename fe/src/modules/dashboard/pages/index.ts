import { lazy } from 'react';


export const DashboardHomePage = lazy(() => import('./DashboardHomePage.tsx'));
export const RolesPage = lazy(() => import('./RolesPage.tsx'));
export const UsersPage = lazy(() => import('./UsersPage.tsx'));
export const HistoryLogPage = lazy(() => import('./HistoryLogPage.tsx'));

export { ActionsManagerPage } from './ActionsManagerPage';
