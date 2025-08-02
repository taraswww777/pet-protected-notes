import { FC, useEffect, useState } from 'react';
import { AuthServiceApi } from '../../../api/AuthServiceApi.ts';
import { UserDTO } from 'protected-notes-be/src/db/schemas';

const UserPage: FC = () => {
  const [userInfo, setUserInfo] = useState<UserDTO>();

  useEffect(() => {
    AuthServiceApi.getCurrentUserInfo().then(({ data }) => setUserInfo(data));
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Профиль пользователя</h1>
      <div className="max-w-md mx-auto">
        <p>id: {userInfo?.id}</p>
        <p>login: {userInfo?.login}</p>

        <div>
          Сменить пароль
        </div>
      </div>
    </div>
  );
};

export default UserPage;
