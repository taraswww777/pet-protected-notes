import { useState } from 'react';
import { UsersTable } from '../components/UsersTable';
import { UserRoleModal } from '../modals/UserRoleModal';

type User = {
  id: number;
  login: string;
  roles: string[];
};

type Role = {
  id: number;
  name: string;
};

const UsersPage = () => {
  // TODO: #97 UsersPage. Заменить mock-данные на реальный запрос к API
  const [users, setUsers] = useState<User[]>([
    { id: 1, login: 'admin@example.com', roles: ['Администратор'] },
    { id: 2, login: 'moderator@example.com', roles: ['Модератор'] },
    { id: 3, login: 'user@example.com', roles: ['Пользователь'] },
  ]);

  const [allRoles] = useState<Role[]>([
    { id: 1, name: 'Администратор' },
    { id: 2, name: 'Модератор' },
    { id: 3, name: 'Пользователь' },
  ]);

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedUser(null);
    setIsModalOpen(false);
  };

  // TODO: #98 UsersPage. Добавить обработку ошибок при сохранении ролей
  const handleSaveRoles = (roles: string[]) => {
    if (!selectedUser) return;

    setUsers(users.map(user =>
      user.id === selectedUser.id
        ? { ...user, roles }
        : user,
    ));
    handleCloseModal();
  };

  return (
    <div>
      <UsersTable users={users} onEditRoles={handleOpenModal} />

      <UserRoleModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        user={selectedUser as User}
        allRoles={allRoles}
        onSave={handleSaveRoles}
      />
    </div>
  );
};

export default UsersPage;
