import { FC } from 'react';
import { LoginForm } from '../components/LoginForm';

export const LoginPage: FC = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Вход в систему</h1>
      <div>
        <LoginForm />
        <div className="text-sm mt-4">
          <p>Если у вас нет аккаунта, <a href="/register" className="text-blue-500 hover:text-blue-700">регистрация</a>.
          </p>
          <p><a href="/password-reset" className="text-blue-500 hover:text-blue-700">Забыли пароль?</a></p>
        </div>
      </div>
    </div>
  );
};
