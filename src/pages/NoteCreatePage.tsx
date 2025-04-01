import React from 'react';
import { NoteEditor } from '../components/NoteEditor.tsx';

export const NoteCreatePage: React.FC = () => {
  const handleSubmit = (values: { title: string; content: string }) => {
    // Здесь будет логика создания заметки
    console.log('Создание заметки:', values);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Создание новой заметки</h1>

      <div className="bg-gray-100 p-4 rounded">
        <NoteEditor onSubmit={handleSubmit} />
      </div>
    </div>
  );
};
