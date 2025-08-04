import { FC, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { AuthServiceApi } from '../../../api/AuthServiceApi.ts';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Схема валидации с Zod
const passwordChangeSchema = z.object({
  currentPassword: z.string().min(1, 'Текущий пароль обязателен'),
  newPassword: z.string()
    .min(1, 'Новый пароль обязателен')
    .min(8, 'Пароль должен содержать минимум 8 символов')
    .refine(val => !val.includes(' '), 'Пароль не должен содержать пробелы'),
  confirmNewPassword: z.string().min(1, 'Подтверждение пароля обязательно'),
}).refine(data => data.newPassword === data.confirmNewPassword, {
  message: 'Пароли не совпадают',
  path: ['confirmNewPassword'],
}).refine(data => data.newPassword !== data.currentPassword, {
  message: 'Новый пароль должен отличаться от текущего',
  path: ['newPassword'],
});

type ChangePasswordFormData = z.infer<typeof passwordChangeSchema>;

const ChangePasswordPage: FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(passwordChangeSchema),
  });

  const onSubmit = async (data: ChangePasswordFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      await AuthServiceApi.changePassword({
        oldPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      setSuccess(true);
      setTimeout(() => navigate('/user'), 2000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Смена пароля</h1>

      <Link
        to="/user"
        className="inline-flex items-center mb-6 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
      >
        ← Назад к профилю
      </Link>

      {success ? (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          Пароль успешно изменен! Вы будете перенаправлены...
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="currentPassword"
                   className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Текущий пароль
            </label>
            <input
              id="currentPassword"
              type="password"
              {...register('currentPassword')}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 ${
                errors.currentPassword
                  ? 'border-red-300 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
              } dark:bg-gray-700 dark:border-gray-600 dark:text-white`}
              disabled={isLoading}
              autoComplete="current-password"
            />
            {errors.currentPassword && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.currentPassword.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Новый пароль
            </label>
            <input
              id="newPassword"
              type="password"
              {...register('newPassword')}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 ${
                errors.newPassword
                  ? 'border-red-300 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
              } dark:bg-gray-700 dark:border-gray-600 dark:text-white`}
              disabled={isLoading}
              autoComplete="new-password"
            />
            {errors.newPassword && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.newPassword.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="confirmNewPassword"
                   className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Подтвердите новый пароль
            </label>
            <input
              id="confirmNewPassword"
              type="password"
              {...register('confirmNewPassword')}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 ${
                errors.confirmNewPassword
                  ? 'border-red-300 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
              } dark:bg-gray-700 dark:border-gray-600 dark:text-white`}
              disabled={isLoading}
              autoComplete="new-password"
            />
            {errors.confirmNewPassword && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.confirmNewPassword.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg"
                     fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Изменение...
              </>
            ) : 'Изменить пароль'}
          </button>
        </form>
      )}
    </div>
  );
};

export default ChangePasswordPage;
