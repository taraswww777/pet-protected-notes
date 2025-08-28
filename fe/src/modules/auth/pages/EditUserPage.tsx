import React, { FC, useEffect, useState } from 'react';
import { AuthServiceApi } from '../../../api/AuthServiceApi.ts';
import {
  UserInfoUpdateBody,
} from 'protected-notes-be/src/modules/userInfo/userInfo.validation.schema.ts';
import { useNotification } from '../../../services/NotificationService';
import { Button } from '../../../uiKit/Button';
import { z } from 'zod';
import {
  firstNameValidations,
  secondNameValidations,
  thirdNameValidations,
} from 'protected-notes-common/src/zodValidators/fioValidations.ts';


// Схема валидации для формы
const userInfoFormSchema = z.object({
  firstName: firstNameValidations(),
  secondName: secondNameValidations(),
  thirdName: thirdNameValidations(),
}).partial();

// Тип для валидированных данных
export type UserInfoFormData = z.infer<typeof userInfoFormSchema>;

const EditUserPage: FC = () => {
  const [userInfo, setUserInfo] = useState<Partial<UserInfoUpdateBody>>({});
  const [errors, setErrors] = useState<Partial<Record<keyof UserInfoUpdateBody, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showSuccessNotification, showErrorNotification } = useNotification();

  useEffect(() => {
    AuthServiceApi.getCurrentUserInfoDetail().then(({ data }) => {
      // Приводим данные к форме, исключая userId и другие ненужные поля
      setUserInfo({
        firstName: data.firstName || '',
        secondName: data.secondName || '',
        thirdName: data.thirdName || '',
      });
    });
  }, []);

  const validateField = (name: keyof UserInfoUpdateBody, value: string) => {
    try {
      // Валидируем отдельное поле
      if (name === 'firstName' && value) {
        userInfoFormSchema.shape.firstName.parse(value);
      } else if (name === 'secondName' && value) {
        userInfoFormSchema.shape.secondName.parse(value);
      } else if (name === 'thirdName' && value) {
        userInfoFormSchema.shape.thirdName.parse(value);
      }

      // Очищаем ошибку для поля
      setErrors(prev => ({ ...prev, [name]: undefined }));
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldError = error.issues[0]?.message || 'Неверное значение';
        setErrors(prev => ({ ...prev, [name]: fieldError }));
        return false;
      }
      return true;
    }
  };

  const validateForm = (data: Partial<UserInfoFormData>): boolean => {
    try {
      userInfoFormSchema.parse(data);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Partial<Record<keyof UserInfoFormData, string>> = {};

        error.issues.forEach(err => {
          const fieldName = err.path[0] as keyof UserInfoFormData;
          if (fieldName) {
            newErrors[fieldName] = err.message;
          }
        });

        setErrors(newErrors);
        return false;
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm(userInfo)) {
      showErrorNotification('Пожалуйста, исправьте ошибки в форме');
      return;
    }

    setIsSubmitting(true);

    try {
      await AuthServiceApi.updateUserInfo(userInfo);
      showSuccessNotification('Данные успешно обновлены');
      setErrors({});
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.response?.data?.details) {
        // Обработка ошибок валидации с сервера
        const serverErrors: Partial<Record<keyof UserInfoFormData, string>> = {};

        error.response.data.details.forEach((detail: { field: string; message: string }) => {
          const fieldName = detail.field as keyof UserInfoFormData;
          if (fieldName) {
            serverErrors[fieldName] = detail.message;
          }
        });

        setErrors(serverErrors);
        showErrorNotification('Ошибка валидации данных');
      } else {
        showErrorNotification('Произошла ошибка при обновлении данных');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const fieldName = name as keyof UserInfoFormData;

    const newUserInfo = { ...userInfo, [fieldName]: value || null };
    setUserInfo(newUserInfo);

    // Валидируем поле при изменении
    validateField(fieldName, value);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const fieldName = name as keyof UserInfoFormData;

    // Валидируем поле при потере фокуса
    validateField(fieldName, value);
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Редактирование пользователя</h1>

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Имя</label>
          <input
            type="text"
            name="firstName"
            value={userInfo?.firstName || ''}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full px-3 py-2 border rounded-md ${
              errors.firstName ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Введите имя"
          />
          {errors.firstName && (
            <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Фамилия</label>
          <input
            type="text"
            name="secondName"
            value={userInfo?.secondName || ''}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full px-3 py-2 border rounded-md ${
              errors.secondName ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Введите фамилию"
          />
          {errors.secondName && (
            <p className="mt-1 text-sm text-red-600">{errors.secondName}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Отчество</label>
          <input
            type="text"
            name="thirdName"
            value={userInfo?.thirdName || ''}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full px-3 py-2 border rounded-md ${
              errors.thirdName ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Введите отчество"
          />
          {errors.thirdName && (
            <p className="mt-1 text-sm text-red-600">{errors.thirdName}</p>
          )}
        </div>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Сохранение...' : 'Сохранить изменения'}
        </Button>

        {Object.keys(errors).length > 0 && !errors.firstName && !errors.secondName && !errors.thirdName && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">Пожалуйста, исправьте ошибки в форме</p>
          </div>
        )}
      </form>
    </div>
  );
};

export default EditUserPage;
