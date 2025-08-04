import { FC } from 'react';
import { NoteEditor, NoteEditorMode } from '../components/NoteEditor.tsx';

const NoteCreatePage: FC = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Создание новой заметки</h1>

      <div className="bg-gray-100 p-4 rounded">
        <NoteEditor mode={NoteEditorMode.create} />
      </div>
    </div>
  );
};

export default NoteCreatePage;
