import { useEffect, useState } from 'react';
import { Input, InputVariant } from '../../../uiKit/form/Input';
import { Button } from '../../../uiKit/Button';
import { AuthServiceApi } from '../../../api/AuthServiceApi';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../AuthProvider';

const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/user');
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Валидация email
    if (!email) {
      setError('Email обязателен');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Введите корректный email');
      return;
    }

    setIsLoading(true);
    try {
      await AuthServiceApi.recoverPassword({ login: email });
      setSuccess(true);
    } catch (err) {
      setError('Произошла ошибка при отправке запроса');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">Восстановление пароля</h1>

      {success ? (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          <p>Инструкции по восстановлению пароля отправлены на {email}</p>
          <p>
            <Link
              to="/login"
              className="mt-2 inline-block text-blue-600 hover:text-blue-800"
            >
              Вернуться на страницу входа
            </Link>
          </p>
          <p>
            <Link
              to="/reset-password"
              className="mt-2 inline-block text-blue-600 hover:text-blue-800"
            >
              Сброс пароля
            </Link>
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <p className="text-gray-600 mb-4">
            Введите email, указанный при регистрации. Мы отправим вам инструкции по восстановлению пароля.
          </p>

          <Input
            label="Email"
            type="email"
            name="email"
            id="email"
            placeholder="your@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={error}
            variant={error ? InputVariant.DANGER : InputVariant.DEFAULT}
          />

          <Button
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? 'Отправка...' : 'Отправить инструкции'}
          </Button>

          <div className="text-center mt-4">
            <Link
              to="/login"
              className="text-blue-600 hover:text-blue-800"
            >
              Назад к авторизации
            </Link>
          </div>
        </form>
      )}
    </div>
  );
};

export default ForgotPasswordPage;
