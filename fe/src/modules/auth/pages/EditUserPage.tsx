import { FC, useEffect, useState } from 'react';
import { AuthServiceApi } from '../../../api/AuthServiceApi.ts';

const EditUserPage: FC = () => {
  const [userInfo, setUserInfo] = useState<any>();

  useEffect(() => {
    AuthServiceApi.getCurrentUserInfoDetail().then(({ data }) => setUserInfo(data));
  }, []);

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">Редактирование пользователя</h1>

      <div>
        {JSON.stringify(userInfo, undefined, 2)}
      </div>
    </div>
  );
};

export default EditUserPage;
