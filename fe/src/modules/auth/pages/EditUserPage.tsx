import React, { FC, useEffect, useState } from 'react';
import { AuthServiceApi } from '../../../api/AuthServiceApi.ts';
import { schema } from 'protected-notes-be/src/db';
import { useNotification } from '../../../services/NotificationService';
import { Button } from '../../../uiKit/Button';

const EditUserPage: FC = () => {
  const [userInfo, setUserInfo] = useState<Partial<schema.UserInfoSelect>>({});
  const { showSuccessNotification } = useNotification();

  useEffect(() => {
    AuthServiceApi.getCurrentUserInfoDetail().then(({ data }) => setUserInfo(data));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInfo) return;
    await AuthServiceApi.updateUserInfo(userInfo).then(() => {
      showSuccessNotification('Данные обновлены')
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserInfo((prev = {}) => ({ ...prev, [name]: value }));
  };


  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Редактирование пользователя</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Имя</label>
          <input
            type="text"
            name="firstName"
            value={userInfo?.firstName || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Фамилия</label>
          <input
            type="text"
            name="secondName"
            value={userInfo?.secondName || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Отчество</label>
          <input
            type="text"
            name="thirdName"
            value={userInfo?.thirdName || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <Button type="submit">
          Сохранить изменения
        </Button>
      </form>
    </div>
  );
};

export default EditUserPage;
