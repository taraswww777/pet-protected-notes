import { useState } from 'react';
import { RolesTable } from '../components/RolesTable';
import { RoleInfoModal } from '../modals/RoleInfoModal.tsx';

type Role = {
  id: number;
  name: string;
  description: string;
  userCount: number;
};

const RolesPage = () => {
  const [roles, setRoles] = useState<Role[]>([
    { id: 1, name: 'Администратор', description: 'Полный доступ', userCount: 5 },
    { id: 2, name: 'Модератор', description: 'Ограниченные права', userCount: 12 },
    { id: 3, name: 'Пользователь', description: 'Базовые права', userCount: 154 },
  ]);

  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDelete = (id: number) => {
    setRoles(roles.filter(role => role.id !== id));
  };

  const handleSave = (roleData: { name: string; description: string }) => {
    if (selectedRole) {
      // Обновление существующей роли
      setRoles(roles.map(r => r.id === selectedRole.id ? { ...r, ...roleData } : r));
    } else {
      // Добавление новой роли
      const newRole = {
        ...roleData,
        id: Math.max(...roles.map(r => r.id), 0) + 1,
        userCount: 0,
      };
      setRoles([...roles, newRole]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold mb-4">Роли</h1>

      <RolesTable
        roles={roles}
        onAddRole={() => {
          setSelectedRole(null);
          setIsModalOpen(true);
        }}
        onEditRole={(role: Role) => {
          setSelectedRole(role);
          setIsModalOpen(true);
        }}
        onDeleteRole={handleDelete}
      />
      <RoleInfoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        role={selectedRole}
        onSave={handleSave}
      />
    </div>
  );
};

export default RolesPage;
