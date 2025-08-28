import React, { useState } from 'react';
import { useAuth } from '../AuthProvider';
import { Input, InputVariant } from '../../../uiKit/form/Input';

interface RegisterFormValues {
  login: string;
  password: string;
  confirmPassword: string;
}

export const RegisterForm: React.FC = () => {
  const [formData, setFormData] = useState<RegisterFormValues>({
    login: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Partial<RegisterFormValues>>({});

  const { register } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear error when user starts typing
    if (errors[name as keyof RegisterFormValues]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = () => {
    const newErrors: Partial<RegisterFormValues> = {};

    if (!formData.login) {
      newErrors.login = 'Логин обязателен';
    }
    if (!formData.password) {
      newErrors.password = 'Пароль обязателен';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Пароль должен содержать минимум 8 символов';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Пароли не совпадают';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      register({
        login: formData.login,
        password: formData.password,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Логин"
        type="text"
        name="login"
        id="login"
        value={formData.login}
        onChange={handleChange}
        error={errors.login}
        variant={errors.login ? InputVariant.DANGER : InputVariant.DEFAULT}
        placeholder="Введите ваш логин"
      />

      <Input
        label="Пароль"
        type="password"
        name="password"
        id="password"
        value={formData.password}
        onChange={handleChange}
        error={errors.password}
        variant={errors.password ? InputVariant.DANGER : InputVariant.DEFAULT}
        placeholder="Не менее 8 символов"
      />

      <Input
        label="Подтвердите пароль"
        type="password"
        name="confirmPassword"
        id="confirmPassword"
        value={formData.confirmPassword}
        onChange={handleChange}
        error={errors.confirmPassword}
        variant={errors.confirmPassword ? InputVariant.DANGER : InputVariant.DEFAULT}
        placeholder="Повторите ваш пароль"
      />

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
      >
        Зарегистрироваться
      </button>
    </form>
  );
};
