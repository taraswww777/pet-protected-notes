import React from 'react';
import { RegisterForm } from '../components/RegisterForm';

export const RegisterPage: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Регистрация</h1>
      <div className="max-w-md mx-auto">
        <RegisterForm />
      </div>
    </div>
  );
}; 