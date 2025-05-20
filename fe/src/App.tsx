import { BrowserRouter } from 'react-router';
import { store } from './store';
import { Provider } from 'react-redux';
import { Router } from './Router';
import { AuthProvider } from './contexts/AuthProvider';
import { PageTemplate } from './components/PageTemplate.tsx';

export function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AuthProvider>
          <PageTemplate>
            <Router />
          </PageTemplate>
        </AuthProvider>
      </BrowserRouter>
    </Provider>
  );
}
