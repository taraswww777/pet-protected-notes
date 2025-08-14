import { Route, Routes } from 'react-router';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { DashboardHomePage } from './pages';
import { ErrorFallback } from '../../components/ErrorFallback.tsx';
import { Loader } from '../../uiKit/Loader.tsx';


export const DashboardRouter = () => {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Suspense fallback={<Loader />}>
        <Routes>
          {/* Основные страницы */}
          <Route index element={<DashboardHomePage />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
};
