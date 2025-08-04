import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { NoteEditor } from '../components/NoteEditor';
import { NotesServiceApi } from '../api/NotesServiceApi.ts';
import { NoteDTO } from '../api/types/noteDTO.ts';
import { RouteWithID } from '../types/RouteWithID.ts';

export const NoteEditPage: React.FC = () => {
  const { id } = useParams<RouteWithID>();
  const [note, setNote] = useState<NoteDTO | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadNote = async () => {
      try {
        if (!id) return;
        const data = await NotesServiceApi.getNoteById(id);
        setNote(data);
      } catch (error) {
        console.error('Ошибка при загрузке заметки:', error);
      } finally {
        setLoading(false);
      }
    };

    loadNote();
  }, [id]);

  const handleSubmit = async (values: { title: string; content: string }) => {
    try {
      if (!id) return;
      const updatedNote = await NotesServiceApi.updateNote(id, values);
      setNote(updatedNote);
      // Здесь можно добавить уведомление об успешном сохранении
    } catch (error) {
      console.error('Ошибка при сохранении заметки:', error);
      // Здесь можно добавить уведомление об ошибке
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!note) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Заметка не найдена</h1>
        <p className="text-gray-600">
          Извините, но запрашиваемая заметка не существует или была удалена.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Редактирование заметки</h1>

      <div className="bg-gray-100 p-4 rounded">
        <NoteEditor
          initialValues={note}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};

export default NoteEditPage;
