import React, { useState, useEffect } from 'react';
import { BaseModal } from '../../../uiKit/components/BaseModal';
import { RoleServiceApi } from '../../../api/RoleServiceApi';
import { Button, ButtonVariant } from '../../../uiKit/Button';
import { Loader } from '../../../uiKit/Loader';
import { schema } from 'protected-notes-be/src/db/index.ts';
import { useNotification } from '../../../services/NotificationService';
import { NotificationType } from '../../../services/NotificationService/NotificationService.types.ts';

interface AddRolesToActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  actionId: number;
  existingRoleIds: number[];
  refreshData: () => void;
}

export const AddRolesToActionModal: React.FC<AddRolesToActionModalProps> = ({
  isOpen,
  onClose,
  actionId,
  existingRoleIds,
  refreshData,
}) => {
  const [allRoles, setAllRoles] = useState<schema.RolesSelect[]>([]);
  const [selectedRoleIds, setSelectedRoleIds] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showNotification } = useNotification();

  useEffect(() => {
    if (isOpen) {
      loadRoles();
    }
  }, [isOpen]);

  useEffect(() => {
    // При загрузке ролей автоматически выбираем уже привязанные
    if (allRoles.length > 0 && existingRoleIds.length > 0) {
      setSelectedRoleIds(existingRoleIds);
    }
  }, [allRoles, existingRoleIds]);

  const loadRoles = async () => {
    setIsLoading(true);
    try {
      const roles = await RoleServiceApi.getRoles();
      setAllRoles(roles);
    } catch (error) {
      console.error('Ошибка при загрузке ролей:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleToggle = (roleId: number) => {
    setSelectedRoleIds(prev =>
      prev.includes(roleId)
        ? prev.filter(id => id !== roleId)
        : [...prev, roleId],
    );
  };

  const handleSelectAll = () => {
    setSelectedRoleIds(allRoles.map(role => role.id));
  };

  const handleDeselectAll = () => {
    setSelectedRoleIds([]);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Сначала удаляем все текущие связи для этого действия
      await RoleServiceApi.removeAllRolesFromAction(actionId);

      // Затем добавляем выбранные роли (если есть)
      if (selectedRoleIds.length > 0) {
        await RoleServiceApi.addRolesToAction(actionId, selectedRoleIds);
      }

      refreshData();
      showNotification('Роли действия успешно обновлены', { type: NotificationType.success });
      onClose();
    } catch (error) {
      console.error('Ошибка при обновлении ролей:', { type: NotificationType.danger });
      showNotification('Ошибка при обновлении ролей', { type: NotificationType.danger });
    } finally {
      setIsSubmitting(false);
    }
  };

  const footer = (
    <div className="flex justify-between items-center">
      <div className="flex space-x-2">
        <Button
          variant={ButtonVariant.NEUTRAL}
          onClick={handleSelectAll}
          disabled={isSubmitting}
          className="text-xs"
        >
          Выбрать все
        </Button>
        <Button
          variant={ButtonVariant.NEUTRAL}
          onClick={handleDeselectAll}
          disabled={isSubmitting}
          className="text-xs"
        >
          Снять все
        </Button>
      </div>
      <div className="flex space-x-3">
        <Button
          variant={ButtonVariant.NEUTRAL}
          onClick={onClose}
          disabled={isSubmitting}
        >
          Отмена
        </Button>
        <Button
          variant={ButtonVariant.PRIMARY}
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Сохранение...' : 'Сохранить'}
        </Button>
      </div>
    </div>
  );

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Управление ролями действия"
      footer={footer}
      maxWidth="lg"
    >
      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
            <p className="text-sm text-blue-800">
              Выберите роли, которые должны иметь доступ к этому действию
            </p>
          </div>

          <div className="max-h-96 overflow-y-auto">
            <div className="space-y-2">
              {allRoles.map(role => (
                <label
                  key={role.id}
                  className="flex items-center p-3 border rounded-md hover:bg-gray-50 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedRoleIds.includes(role.id)}
                    onChange={() => handleRoleToggle(role.id)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="ml-3 text-sm font-medium text-gray-700">
                    {role.name}
                  </span>
                  {role.description && (
                    <span className="ml-2 text-xs text-gray-500">
                      ({role.description})
                    </span>
                  )}
                </label>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-md p-3">
            <p className="text-sm text-gray-800">
              Выбрано ролей: {selectedRoleIds.length} из {allRoles.length}
            </p>
          </div>
        </div>
      )}
    </BaseModal>
  );
};
