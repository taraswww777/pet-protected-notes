import { Route, Routes } from 'react-router';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { ActionsManagerPage, DashboardHomePage, RolesPage, SettingsPage, UsersPage } from './pages';
import { ErrorFallback } from '../../components/ErrorFallback.tsx';
import { Loader } from '../../uiKit/Loader.tsx';
import { DashboardLayout } from './components/DashboardLayout.tsx';


export const DashboardRouter = () => {
  return (
    <DashboardLayout>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route index element={<DashboardHomePage />} />
            <Route path="roles" element={<RolesPage />} />
            <Route path="actions" element={<ActionsManagerPage />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </DashboardLayout>
  );
};
