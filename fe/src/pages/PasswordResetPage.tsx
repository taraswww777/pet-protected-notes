import { FC } from 'react';

const PasswordResetPage: FC = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Сброс пароля</h1>
      <p className="mb-4">
        Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam,
        nisi ut aliquid ex ea commodi consequatur.
      </p>
      <div className="bg-gray-100 p-4 rounded">
        <p>
          Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur,
          vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?
        </p>
      </div>
    </div>
  );
};

export default PasswordResetPage;
