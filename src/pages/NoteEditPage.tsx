import React from 'react';

export const NoteEditPage: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Редактирование заметки</h1>
      <p className="mb-4">
        Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime 
        placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus.
      </p>
      <div className="bg-gray-100 p-4 rounded">
        <p>
          Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et 
          voluptates repudiandae sint et molestiae non recusandae.
        </p>
      </div>
    </div>
  );
}; 