import React, { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { getNotesList } from '../api/getNoteById.ts';
import { NoteDTO } from '../api/types/noteDTO.ts';
import { Pagination } from './Pagination.tsx';
import { PAGE_SIZE_DEFAULT } from '../constants/common.ts';


export const NotesList: React.FC = () => {
  const [notesList, setNotesList] = useState<NoteDTO[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(PAGE_SIZE_DEFAULT);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [hasNextPage, setHasNextPage] = useState<boolean>(false);
  const [hasPreviousPage, setHasPreviousPage] = useState<boolean>(false);

  useEffect(() => {
    getNotesList({ page: currentPage, limit: pageSize }).then(({ items, hasNext, hasPrevious, totalPages }) => {
      setNotesList(items);
      setHasNextPage(hasNext);
      setHasPreviousPage(hasPrevious);
      setTotalPages(totalPages);
    });
  }, [currentPage, pageSize]);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Последние новости</h2>
      {notesList.map((item) => (
        <div
          key={item.id}
          className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <h3 className="text-xl font-semibold text-gray-800">
            <Link to={`/notes/${item.id}`} className="hover:underline">{item.title}</Link>
          </h3>
          <p className="text-gray-600 mt-2">{item.content}</p>
        </div>
      ))}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        hasNextPage={hasNextPage}
        hasPreviousPage={hasPreviousPage}
        onPageSizeChange={setPageSize}
        pageSize={pageSize}
      />
    </div>
  );
};
