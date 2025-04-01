import React from 'react';

export const NoteViewPage: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Просмотр заметки</h1>
      <p className="mb-4">
        Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias 
        consequatur aut perferendis doloribus asperiores repellat.
      </p>
      <div className="bg-gray-100 p-4 rounded">
        <p>
          Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, 
          vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?
        </p>
      </div>
    </div>
  );
};

export default NoteViewPage; 