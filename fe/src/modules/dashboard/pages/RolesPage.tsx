import { useState } from 'react';
import { RolesTable } from '../components/RolesTable';
import { RoleInfoModal } from '../modals/RoleInfoModal.tsx';
import { RoleServiceApi } from '../../../api/RoleServiceApi.ts';
import { useMountEffect } from '../../../hooks/useMountEffect.ts';
import { UIRole } from '../../../types/UIRole.ts';
import { BaseConfirmModal } from '../../../uiKit/components/BaseConfirmModal.tsx';
import { DashboardPageBaseTemplate } from '../components/DashboardPageBaseTemplate.tsx';


const RolesPage = () => {
  const [roles, setRoles] = useState<UIRole[]>([]);

  const [selectedRole, setSelectedRole] = useState<UIRole | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState<number | null>(null);

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
    setRoleToDelete(id);
    setIsConfirmModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (roleToDelete !== null) {
      try {
        await RoleServiceApi.deleteRole(roleToDelete);
        setRoles(roles.filter(role => role.id !== roleToDelete));
      } catch (error) {
        console.error('Ошибка при удалении роли:', error);
      } finally {
        setIsConfirmModalOpen(false);
        setRoleToDelete(null);
      }
    }
  };

  const handleSave = async (roleData: { name: string; description: string }) => {
    try {
      if (selectedRole) {
        await RoleServiceApi.updateRole(selectedRole.id, roleData);
      } else {
        await RoleServiceApi.createRole(roleData);
      }
      await loadData();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Ошибка при сохранении роли:', error);
    }
  };

  return (
    <DashboardPageBaseTemplate title={'Роли'}>
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
      <BaseConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Подтверждение удаления роли"
        message="Вы уверены, что хотите удалить эту роль?"
      />
    </DashboardPageBaseTemplate>
  );
};

export default RolesPage;
