import React from 'react';
import { useNavigate } from 'react-router';
import { NoteDTO } from '../api/types/noteDTO';

interface NoteCardProps {
  note: NoteDTO;
}

export const NoteCard: React.FC<NoteCardProps> = ({ note }) => {
  const navigate = useNavigate();

  const handleEditClick = () => {
    navigate(`/notes/${note.id}/edit`);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{note.title}</h1>
      <div className="bg-gray-100 p-4 rounded">
        <p className="whitespace-pre-wrap">{note.content}</p>
      </div>
      <button
        onClick={handleEditClick}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Редактировать
      </button>
    </div>
  );
};
