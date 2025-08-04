import React, { FC, FormEvent, useState } from 'react';
import { Input, InputVariant } from '../../../uiKit/Input';
import { Button } from '../../../uiKit/Button';
import { useAuth } from '../AuthProvider';

interface LoginFormData {
  login: string;
  password: string;
}

export const LoginForm: FC = () => {
  const { login } = useAuth();
  const [formData, setFormData] = useState<LoginFormData>({
    login: '',
    password: '',
  });
  const [errors, setErrors] = useState<Partial<LoginFormData>>({});

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();

    // Простая валидация
    const newErrors: Partial<LoginFormData> = {};
    if (!formData.login) newErrors.login = 'Email обязателен';
    if (!formData.password) newErrors.password = 'Пароль обязателен';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    login(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    // Очищаем ошибку при изменении поля
    if (errors[name as keyof LoginFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <Input
        label="Email"
        type="email"
        name="login"
        id="email"
        placeholder="you@example.com"
        value={formData.login}
        onChange={handleChange}
        error={errors.login}
        variant={errors.login ? InputVariant.DANGER : InputVariant.DEFAULT}
      />
      <Input
        label="Пароль"
        type="password"
        name="password"
        id="password"
        placeholder="Ваш пароль"
        value={formData.password}
        onChange={handleChange}
        error={errors.password}
        variant={errors.password ? InputVariant.DANGER : InputVariant.DEFAULT}
      />
      <div>
        <Button type="submit">Войти</Button>
      </div>
    </form>
  );
};
