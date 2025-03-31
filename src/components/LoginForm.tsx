import { FC, FormEvent, useState } from 'react';
import { FormInput } from '../uiKit/FormInput';
import { Button } from '../uiKit/Button';
import { useAuth } from '../contexts/AuthProvider';
import { useNavigate } from 'react-router';

export const LoginForm: FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    // Здесь можно добавить логику авторизации
    console.log('Отправка формы:', formData);
    login();
    navigate('/');
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
        name="email"
        id="email"
        placeholder="you@example.com"
        value={formData.email}
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
