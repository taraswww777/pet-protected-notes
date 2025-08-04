import React, { useState } from 'react';
import { Input, InputVariant } from '../../../uiKit/Input';
import { Button } from '../../../uiKit/Button';
import { AuthServiceApi } from '../../../api/AuthServiceApi';
import { Link, useNavigate } from 'react-router';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

// Схема валидации с Zod
const resetPasswordSchema = z.object({
  login: z.email('Введите корректный email').min(1, 'Email обязателен'),
  resetCode: z.string()
    .length(6, 'Код должен содержать 6 цифр')
    .regex(/^\d+$/, 'Код должен содержать только цифры'),
  newPassword: z.string()
    .min(6, 'Пароль должен содержать минимум 6 символов')
    .refine(val => !val.includes(' '), 'Пароль не должен содержать пробелы'),
});

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

const ResetPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      await AuthServiceApi.resetPassword({
        login: data.login,
        resetCode: data.resetCode,
        newPassword: data.newPassword,
      });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError('Неверный код восстановления или произошла ошибка');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">Сброс пароля</h1>

      {success ? (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          <p>Пароль успешно изменен! Вы будете перенаправлены на страницу входа.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Email"
            type="email"
            {...register('login')}
            error={errors.login?.message}
            variant={errors.login ? InputVariant.DANGER : InputVariant.DEFAULT}
            placeholder="your@example.com"
            autoComplete="username"
          />

          <Input
            label="Код восстановления"
            type="text"
            {...register('resetCode')}
            error={errors.resetCode?.message}
            variant={errors.resetCode ? InputVariant.DANGER : InputVariant.DEFAULT}
            placeholder="Введите 6-значный код"
            maxLength={6}
          />

          <Input
            label="Новый пароль"
            type="password"
            {...register('newPassword')}
            error={errors.newPassword?.message}
            variant={errors.newPassword ? InputVariant.DANGER : InputVariant.DEFAULT}
            placeholder="Не менее 6 символов"
            autoComplete="new-password"
          />

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <Button
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? 'Смена пароля...' : 'Установить новый пароль'}
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

export default ResetPasswordPage;
