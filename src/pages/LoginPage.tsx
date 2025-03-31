import React from 'react';
import { FormInput } from '../uiKit/FormInput';
import { Button } from '../uiKit/Button';

export const LoginPage: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Вход в систему</h1>
      <div>
        <form className="space-y-4">
          <FormInput
            label="Email"
            type="email"
            name="email"
            id="email"
            placeholder="you@example.com"
          />
          <FormInput
            label="Пароль"
            type="password"
            name="password"
            id="password"
            placeholder="Ваш пароль"
          />
          <div>
            <Button type="submit">Войти</Button>
          </div>
        </form>
        <div className="text-sm mt-4">
          <p>Если у вас нет аккаунта, <a href="/register" className="text-blue-500 hover:text-blue-700">регистрация</a>.
          </p>
          <p><a href="/password-reset" className="text-blue-500 hover:text-blue-700">Забыли пароль?</a></p>
        </div>
      </div>
    </div>
  );
};
