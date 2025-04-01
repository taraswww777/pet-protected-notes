import { Navbar } from '../components/NavBar';
import { NewsList } from '../components/NewsList';

export const NotesListPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">
          Список заметок
        </h1>

        <NewsList />
      </main>

    </div>
  );
};

