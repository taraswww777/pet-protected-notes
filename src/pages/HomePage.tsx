import { useState } from 'react';
import { Navbar } from "../components/NavBar";
import { BaseModal } from '../uiKit/components/BaseModal.tsx';

export const HomePage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div>
      <Navbar/>
      <h1>Добро пожаловать на домашнюю страницу!</h1>
      <p>Здесь вы можете увидеть рыбный текст.</p>

      <button
        onClick={() => setIsModalOpen(true)}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        Открыть модальное окно
      </button>

      <BaseModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} footer={<div>footer</div>}>
        <h2 className="text-xl font-bold mb-4">Заголовок модального окна</h2>
        <p>Содержимое модального окна</p>
      </BaseModal>
    </div>
  );
};

