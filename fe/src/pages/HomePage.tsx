import { useState } from 'react';
import { BaseModal } from '../uiKit/components/BaseModal.tsx';
import { BaseConfirmModal } from '../uiKit/components/BaseConfirmModal.tsx';
import { NotesList } from '../components/NotesList.tsx';

const HomePage = () => {
  const [isBaseModalOpen, setIsBaseModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const openSetIsBaseModalOpen = () => {
    let a = '';

    for (let i = 0; i < 9999999; i++) {
      a += i;
    }
    console.log('a:', a);

    setIsBaseModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">
          Добро пожаловать на домашнюю страницу!
        </h1>
        <div className="flex gap-4 mb-8">
          <button
            onClick={openSetIsBaseModalOpen}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600
                     transition-colors duration-200 focus:outline-none focus:ring-2
                     focus:ring-blue-500 focus:ring-offset-2"
          >
            Открыть информационное окно
          </button>

          <button
            onClick={() => setIsConfirmModalOpen(true)}
            className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600
                     transition-colors duration-200 focus:outline-none focus:ring-2
                     focus:ring-red-500 focus:ring-offset-2"
          >
            Открыть окно подтверждения
          </button>
        </div>

        <NotesList />
      </main>

      <BaseModal
        isOpen={isBaseModalOpen}
        onClose={() => setIsBaseModalOpen(false)}
        footer={<div className="px-4 py-3 bg-gray-50">footer</div>}
      >
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Заголовок модального окна
          </h2>
          <p className="text-gray-600">
            Содержимое модального окна
          </p>
        </div>
      </BaseModal>

      <BaseConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={() => {
          // Действия при подтверждении
          setIsConfirmModalOpen(false);
        }}
        title="Подтверждение удаления"
        message="Вы уверены, что хотите удалить этот элемент?"
      />
    </div>
  );
};

export default HomePage;

