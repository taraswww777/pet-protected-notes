import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { getNoteById } from '../api/getNoteById';
import { NoteDTO } from '../api/types/noteDTO';
import { NoteCard } from '../components/NoteCard.tsx';
import { RouteWithID } from '../types/RouteWithID';

const NoteViewPage: React.FC = () => {
  const { id } = useParams<RouteWithID>();
  const [note, setNote] = useState<NoteDTO | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadNote = async () => {
      try {
        if (!id) return;
        const data = await getNoteById(id);
        setNote(data);
      } catch (error) {
        console.error('Ошибка при загрузке заметки:', error);
      } finally {
        setLoading(false);
      }
    };

    loadNote();
  }, [id]);

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

  return <NoteCard note={note} />;
};

export default NoteViewPage; 