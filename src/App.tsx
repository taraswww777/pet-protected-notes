import { BrowserRouter } from 'react-router';
import { store } from './store';
import { Provider } from 'react-redux';
import { Router } from './Router';
import { AuthProvider } from './contexts/AuthProvider';

export function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AuthProvider>
          <Router />
        </AuthProvider>
      </BrowserRouter>
    </Provider>
  );
}
