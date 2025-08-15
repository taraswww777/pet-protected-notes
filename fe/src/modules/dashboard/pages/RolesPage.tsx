import { useState } from 'react';
import { RolesTable } from '../components/RolesTable';
import { RoleInfoModal } from '../modals/RoleInfoModal.tsx';
import { RoleServiceApi } from '../../../api/RoleServiceApi.ts';
import { useMountEffect } from '../../../hooks/useMountEffect.ts';
import { UIRole } from '../../../types/UIRole.ts';


const RolesPage = () => {
  const [roles, setRoles] = useState<UIRole[]>([]);

  const [selectedRole, setSelectedRole] = useState<UIRole | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadData = async () => {
    try {
      const rolesResponse = await RoleServiceApi.getRoles();

      const countsResponse = await RoleServiceApi.getUsersCountByRoles(rolesResponse.map(r => r.id));

      const rolesWithCounts = rolesResponse.map(role => ({
        ...role,
        userCount: countsResponse.find(c => c.roleId === role.id)?.userCount || 0,
      }));

      setRoles(rolesWithCounts);
    } catch (error) {
      console.error('Ошибка при получении данных:', error);
    }
  }

  useMountEffect(() => {
    void loadData();
  });


  const handleDelete = (id: number) => {
    setRoles(roles.filter(role => role.id !== id));
  };

  const handleSave = async (roleData: { name: string; description: string }) => {
    console.log('roleData:', roleData)
    if (selectedRole) {
      // Обновление существующей роли
      // setRoles(roles.map(r => r.id === selectedRole.id ? { ...r, ...roleData } : r));
    } else {
      // Добавление новой роли
      // const newRole = {
      //   ...roleData,
      //   id: Math.max(...roles.map(r => r.id), 0) + 1,
      //   userCount: 0,
      // };
      // setRoles([...roles, newRole]);
    }

    await loadData();
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
        onEditRole={(role: UIRole) => {
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
