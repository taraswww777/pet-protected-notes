import { useState, useEffect } from 'react';
import { UsersTable } from '../components/UsersTable';
import { UserRoleModal } from '../modals/UserRoleModal';
import { RoleServiceApi } from '../../../api/RoleServiceApi.ts';
import { Pagination } from '../../../components/Pagination.tsx';
import { PAGE_SIZE_DEFAULT } from '../../../constants/common.ts';
import { UserWithRolesDTO } from 'protected-notes-be/src/modules/role';
import { schema } from 'protected-notes-be/src/db';
import { DashboardPageBaseTemplate } from '../components/DashboardPageBaseTemplate.tsx';


const UsersPage = () => {
  const [users, setUsers] = useState<UserWithRolesDTO[]>([]);
  const [allRoles, setAllRoles] = useState<schema.RolesSelect[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserWithRolesDTO | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Состояния для пагинации
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE_DEFAULT);
  const [totalPages, setTotalPages] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);

  // Загрузка ролей
  useEffect(() => {
    RoleServiceApi.getRoles()
      .then(roles => {
        setAllRoles(roles);
      })
      .catch(error => {
        console.error('Ошибка при загрузке ролей:', error);
      });
  }, []);

  // Загрузка пользователей с пагинацией
  useEffect(() => {
    RoleServiceApi.getUsers({ page: currentPage, limit: pageSize })
      .then(response => {
        // setUsers(response.items);
        setUsers(response.items);
        setTotalPages(response.totalPages);
        setHasNextPage(response.hasNext);
        setHasPreviousPage(response.hasPrevious);
      })
      .catch(error => {
        console.error('Ошибка при загрузке пользователей:', error);
      });
  }, [currentPage, pageSize]);

  const onEditRoles = (user: UserWithRolesDTO) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedUser(null);
    setIsModalOpen(false);
  };

  const handleSaveRoles = (roleIds: number[]) => {
    if (!selectedUser) return;

    // Оптимистичное обновление UI
    setUsers(users.map(user =>
      user.userId === selectedUser.userId
        ? { ...user, roleIds }
        : user,
    ));

    // Вызов API для сохранения на сервере
    RoleServiceApi.assignRole({
      userId: selectedUser.userId,
      roleIds,
    })
      .then(() => {
        // Данные успешно сохранены на сервере
        console.log('Роли пользователя успешно обновлены');
      })
      .catch(error => {
        console.error('Ошибка при сохранении ролей:', error);
        // Откат изменений в случае ошибки
        setUsers(users); // Восстанавливаем исходный список пользователей
      })
      .finally(() => {
        handleCloseModal();
      });
  };

  return (
    <DashboardPageBaseTemplate title={'Управление пользователями'}>
      {!users.length ? (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="p-6 text-center text-gray-500">
            Пользователи отсутствуют
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <UsersTable
            users={users}
            allRoles={allRoles}
            onEditRoles={onEditRoles}
          />

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              hasNextPage={hasNextPage}
              hasPreviousPage={hasPreviousPage}
              onPageSizeChange={setPageSize}
              pageSize={pageSize}
            />
          )}
        </div>
      )}


      <UserRoleModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        user={selectedUser as UserWithRolesDTO}
        allRoles={allRoles}
        onSave={handleSaveRoles}
      />
    </DashboardPageBaseTemplate>
  );
};

export default UsersPage;
