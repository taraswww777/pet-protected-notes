import { BrowserRouter } from 'react-router';
import { store } from './store';
import { Provider } from 'react-redux';
import { Router } from './Router';
import { AuthProvider } from './contexts/AuthProvider';
import { Navbar } from './components/NavBar.tsx';

export function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AuthProvider>
          <Navbar />
          <Router />
        </AuthProvider>
      </BrowserRouter>
    </Provider>
  );
}
