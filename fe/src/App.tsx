import { BrowserRouter } from 'react-router';
import { store } from './store';
import { Provider } from 'react-redux';
import { Router } from './Router';
import { AuthProvider } from './modules/auth';
import { PageTemplate } from './components/PageTemplate.tsx';
import { NotificationProvider } from './services/NotificationService';

export function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <NotificationProvider>
          <AuthProvider>
            <PageTemplate>
              <Router />
            </PageTemplate>
          </AuthProvider>
        </NotificationProvider>
      </BrowserRouter>
    </Provider>
  );
}
