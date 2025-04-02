import React from 'react';
import { NoteDTO } from '../api/types/noteDTO';

interface NoteCardProps {
  note: NoteDTO;
}

export const NoteCard: React.FC<NoteCardProps> = ({ note }) => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{note.title}</h1>
      <div className="bg-gray-100 p-4 rounded">
        <p className="whitespace-pre-wrap">{note.content}</p>
      </div>
    </div>
  );
};
