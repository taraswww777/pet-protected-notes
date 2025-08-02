import { FC } from 'react';
import { RegisterForm } from '../components/RegisterForm';

const RegisterPage: FC = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Регистрация</h1>
      <div className="max-w-md mx-auto">
        <RegisterForm />
      </div>
    </div>
  );
};

export default RegisterPage;
