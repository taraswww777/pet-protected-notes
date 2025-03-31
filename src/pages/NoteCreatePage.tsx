import React from 'react';

export const NoteCreatePage: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Создание новой заметки</h1>
      <p className="mb-4">
        At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum 
        deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.
      </p>
      <div className="bg-gray-100 p-4 rounded">
        <p>
          Similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. 
          Et harum quidem rerum facilis est et expedita distinctio.
        </p>
      </div>
    </div>
  );
}; 