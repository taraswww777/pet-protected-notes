import React, { useState, useEffect } from 'react';
import { BaseModal } from '../../../uiKit/components/BaseModal';
import { RoleServiceApi } from '../../../api/RoleServiceApi';
import { Button, ButtonVariant } from '../../../uiKit/Button';
import { Loader } from '../../../uiKit/Loader';
import { schema } from 'protected-notes-be/src/db/index.ts';

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

  useEffect(() => {
    if (isOpen) {
      loadRoles();
    }
  }, [isOpen]);

  const loadRoles = async () => {
    setIsLoading(true);
    try {
      const roles = await RoleServiceApi.getRoles();
      setAllRoles(roles);
      setSelectedRoleIds([]);
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

  const handleSubmit = async () => {
    if (selectedRoleIds.length === 0) return;

    setIsSubmitting(true);
    try {
      await RoleServiceApi.addRolesToAction(actionId, selectedRoleIds);
      refreshData();
      onClose();
    } catch (error) {
      console.error('Ошибка при добавлении ролей:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const availableRoles = allRoles.filter(role => !existingRoleIds.includes(role.id));

  const footer = (
    <div className="flex justify-end space-x-3">
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
        disabled={selectedRoleIds.length === 0 || isSubmitting}
      >
        {isSubmitting ? 'Добавление...' : 'Добавить'}
      </Button>
    </div>
  );

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Добавить роли к действию"
      footer={footer}
      maxWidth="lg"
    >
      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader />
        </div>
      ) : (
        <div className="space-y-4">
          {availableRoles.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              Все доступные роли уже добавлены к этому действию
            </p>
          ) : (
            <div className="max-h-96 overflow-y-auto">
              <div className="space-y-2">
                {availableRoles.map(role => (
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
          )}

          {selectedRoleIds.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
              <p className="text-sm text-blue-800">
                Выбрано ролей: {selectedRoleIds.length}
              </p>
            </div>
          )}
        </div>
      )}
    </BaseModal>
  );
};
