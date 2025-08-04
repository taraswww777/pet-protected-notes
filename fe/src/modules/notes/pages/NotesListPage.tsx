import { NotesList } from '../../../components/NotesList.tsx';
import { FC } from 'react';

const NotesListPage: FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">
          Список заметок
        </h1>

        <NotesList />
      </main>

    </div>
  );
};

export default NotesListPage;

