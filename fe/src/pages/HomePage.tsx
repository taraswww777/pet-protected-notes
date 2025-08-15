import { NotesList } from '../components/NotesList.tsx';

const HomePage = () => {


  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">
          Добро пожаловать на домашнюю страницу!
        </h1>

        <NotesList />
      </main>
    </div>
  );
};

export default HomePage;

