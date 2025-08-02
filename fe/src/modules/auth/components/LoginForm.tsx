import React, { FC, FormEvent, useState } from 'react';
import { FormInput } from '../../../uiKit/FormInput.tsx';
import { Button } from '../../../uiKit/Button.tsx';
import { useAuth } from '../../../contexts/AuthProvider';

interface LoginFormData {
  login: string,
  password: string,
}

export const LoginForm: FC = () => {
  const { login } = useAuth();

  const [formData, setFormData] = useState<LoginFormData>({
    login: '',
    password: '',
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    login(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <FormInput
        label="Email"
        type="email"
        name="login"
        id="email"
        placeholder="you@example.com"
        value={formData.login}
        onChange={handleChange}
      />
      <FormInput
        label="Пароль"
        type="password"
        name="password"
        id="password"
        placeholder="Ваш пароль"
        value={formData.password}
        onChange={handleChange}
      />
      <div>
        <Button type="submit">Войти</Button>
      </div>
    </form>
  );
};
