import React, { useState } from 'react';
import { useAuth } from '../../../contexts/AuthProvider';
import { FormInput } from '../../../uiKit/FormInput.tsx';

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
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    const newErrors: Partial<RegisterFormValues> = {};

    if (!formData.login) {
      newErrors.login = 'Логин обязателен';
    }
    if (!formData.password) {
      newErrors.password = 'Пароль обязателен';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Пароли не совпадают';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = (fv: RegisterFormValues) => {
    register({
      login: fv.login,
      password: fv.password,
    });
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">login</label>
        <input
          type="login"
          name="login"
          value={formData.login}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
        {errors.login && <p className="text-red-500 text-sm">{errors.login}</p>}
      </div>

      <div>
        <FormInput label={'Пароль'} type={'password'} name={'password'} id={'password'} placeholder={''}
                   value={formData.password} onChange={handleChange} />
        {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
      </div>

      <div>
        <FormInput label={'Подтвердите пароль'} type={'password'} name={'confirmPassword'} id={'password'}
                   placeholder={''} value={formData.confirmPassword} onChange={handleChange} />
        {errors.confirmPassword && (
          <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
        )}
      </div>

      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
      >
        Зарегистрироваться
      </button>
    </form>
  );
};
