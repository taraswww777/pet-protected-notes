import { FC, useEffect, useState } from 'react';
import { AuthServiceApi } from '../../../api/AuthServiceApi.ts';
import { Link } from 'react-router';
import { schema } from 'protected-notes-be/src/db';
import { LinkButton, ButtonVariant } from '../../../uiKit/Button';

const UserPage: FC = () => {
  const [baseUserInfo, setBaseUserInfo] = useState<schema.UserSelect>();
  const [userInfo, setUserInfo] = useState<Partial<schema.UserInfoSelect>>({});

  useEffect(() => {
    AuthServiceApi.getCurrentUserInfo().then(({ data }) => setBaseUserInfo(data));
    AuthServiceApi.getCurrentUserInfoDetail().then(({ data }) => setUserInfo(data));
  }, []);

  return (
    <div className="container mx-auto p-4 max-w-2xl bg-white dark:bg-gray-800 rounded-lg">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">Профиль пользователя</h1>

      <div className="mb-8 flex gap-4">
        <Link
          to={'/user/change-password'}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Сменить пароль
        </Link>
        <LinkButton
          to={'/user/edit'}
          variant={ButtonVariant.SUCCESS}
        >
          Редактировать данные
        </LinkButton>
      </div>

      <div className="shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200">Основная информация</h2>
        <div className="space-y-3">
          <p className="text-gray-600 dark:text-gray-300">
            <span className="font-medium">ID:</span> {baseUserInfo?.id || 'Загрузка...'}
          </p>
          <p className="text-gray-600 dark:text-gray-300">
            <span className="font-medium">Логин:</span> {baseUserInfo?.login || 'Загрузка...'}
          </p>
        </div>
      </div>

      <div className="shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200">Дополнительная информация</h2>
        <div className="space-y-3">
          <p className="text-gray-600 dark:text-gray-300">
            <span className="font-medium">Имя:</span> {userInfo.firstName || 'Не указано'}
          </p>
          <p className="text-gray-600 dark:text-gray-300">
            <span className="font-medium">Фамилия:</span> {userInfo.secondName || 'Не указано'}
          </p>
          <p className="text-gray-600 dark:text-gray-300">
            <span className="font-medium">Отчество:</span> {userInfo.thirdName || 'Не указано'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserPage;
