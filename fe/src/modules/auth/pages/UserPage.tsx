import { FC, useEffect, useState } from 'react';
import { AuthServiceApi } from '../../../api/AuthServiceApi.ts';
import { UserDTO } from 'protected-notes-be/src/db/schemas';
import { Link } from 'react-router';

const UserPage: FC = () => {
  const [userInfo, setUserInfo] = useState<UserDTO>();

  useEffect(() => {
    AuthServiceApi.getCurrentUserInfo().then(({ data }) => setUserInfo(data));
  }, []);

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">Профиль пользователя</h1>

      <div className="mb-8">
        <Link
          to={'/user/change-password'}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Сменить пароль
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200">Информация о пользователе</h2>
        <div className="space-y-3">
          <p className="text-gray-600 dark:text-gray-300">
            <span className="font-medium">ID:</span> {userInfo?.id || 'Загрузка...'}
          </p>
          <p className="text-gray-600 dark:text-gray-300">
            <span className="font-medium">Логин:</span> {userInfo?.login || 'Загрузка...'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserPage;
