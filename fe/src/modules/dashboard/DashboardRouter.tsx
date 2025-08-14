import { Route, Routes } from 'react-router';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { DashboardHomePage } from './pages';
import { ErrorFallback } from '../../components/ErrorFallback.tsx';
import { Loader } from '../../uiKit/Loader.tsx';
import { DashboardLayout } from './components/DashboardLayout.tsx';


// import { Route, Routes } from 'react-router';
// import { Suspense } from 'react';
// import { ErrorBoundary } from 'react-error-boundary';
// import { DashboardLayout } from './components/DashboardLayout';
// import { RolesPage } from './pages/RolesPage';
// import { ActionsPage } from './pages/ActionsPage';
// import { UsersPage } from './pages/UsersPage';
// import { SettingsPage } from './pages/SettingsPage';
// import { ErrorFallback } from '../../components/ErrorFallback';
// import { Loader } from '../../uiKit/Loader';

export const DashboardRouter = () => {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route index element={<DashboardLayout />}>
            {/*<Route path="roles" element={<RolesPage />} />*/}
            {/*<Route path="actions" element={<ActionsPage />} />*/}
            {/*<Route path="users" element={<UsersPage />} />*/}
            {/*<Route path="settings" element={<SettingsPage />} />*/}
            {/*<Route index element={<RolesPage />} />*/}
          </Route>
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
};
