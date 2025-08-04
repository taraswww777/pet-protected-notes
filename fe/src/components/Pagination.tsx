import React, { useState } from 'react';
import { PAGE_SIZE_DEFAULT, PAGE_SIZE_LIST_DEFAULT } from '../constants/common.ts';

/** Интерфейс свойств компонента Pagination. */
interface PaginationProps {
  /** Текущая страница. */
  currentPage: number;
  /** Общее количество страниц. */
  totalPages: number;
  /** Функция, вызываемая при изменении страницы. */
  onPageChange: (pageNumber: number) => void;
  /** Функция, вызываемая при изменении размера страницы. */
  onPageSizeChange: (pageSize: number) => void;
  /** Флаг наличия следующей страницы. */
  hasNextPage?: boolean;
  /** Флаг наличия предыдущей страницы. */
  hasPreviousPage?: boolean;
  /** Максимальное количество видимых страниц. */
  maxVisiblePages?: number;
  /** Текущий размер страницы. */
  pageSize?: number;
  /** Список доступных размеров страниц. */
  pageSizes?: number[];
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  onPageSizeChange,
  hasNextPage,
  hasPreviousPage,
  maxVisiblePages = 5,
  pageSize = PAGE_SIZE_DEFAULT,
  pageSizes = PAGE_SIZE_LIST_DEFAULT,
}) => {
  const [inputPage, setInputPage] = useState('');

  const handlePageClick = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputPage(e.target.value);
  };

  const handleGoToPage = () => {
    /**
     * Преобразуем значение из строки в целое число с использованием parseInt.
     * Это необходимо для того, чтобы гарантировать, что мы работаем с числовым значением страницы.
     * Без использования parseInt пользовательский ввод может быть некорректным (например, строкой),
     * что приведет к ошибкам при попытке перейти на страницу.
     *
     * Также, второй аргумент функции parseInt установлен в 10, чтобы указать систему счисления.
     * Это предотвращает возможные проблемы с интерпретацией чисел в различных системах счисления,
     * особенно если пользовательский ввод начинается с нуля.
     *
     * @tag #Security
     */
    const pageNumber = parseInt(inputPage, 10);
    if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= totalPages) {
      onPageChange(pageNumber);
      setInputPage('');
    }
  };

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newPageSize = parseInt(e.target.value, 10);
    onPageSizeChange(newPageSize);
    onPageChange(1);
  };

  const halfMaxVisiblePages = Math.floor(maxVisiblePages / 2);

  // Создаем массив для отображаемых страниц
  const visiblePages: number[] = [];

  if (totalPages <= maxVisiblePages) {
    // Если общее количество страниц меньше или равно максимальному видимому количеству,
    // отображаем все страницы
    for (let i = 1; i <= totalPages; i++) {
      visiblePages.push(i);
    }
  } else {
    // Иначе отображаем страницы вокруг текущей страницы
    let startPage = Math.max(1, currentPage - halfMaxVisiblePages);
    let endPage = Math.min(totalPages, currentPage + halfMaxVisiblePages);

    // Корректируем начальную и конечную страницы, чтобы всегда отображалось максимальное количество страниц
    if (endPage - startPage + 1 < maxVisiblePages) {
      if (startPage === 1) {
        endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
      } else {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }
    }

    // Добавляем страницы в массив
    for (let i = startPage; i <= endPage; i++) {
      visiblePages.push(i);
    }
  }

  return (
    <nav aria-label="Page navigation example">
      <ul className="inline-flex">
        {hasPreviousPage && (
          <li>
            <button
              onClick={() => handlePageClick(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-3 py-2 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 ${
                currentPage === 1 ? 'cursor-not-allowed' : ''
              }`}
            >
              Предыдущая
            </button>
          </li>
        )}
        {visiblePages.map((number, index) => (
          <li key={index}>
            <button
              onClick={() => handlePageClick(number)}
              className={`px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 ${
                number === currentPage ? 'bg-blue-50 text-blue-600' : ''
              }`}
            >
              {number}
            </button>
          </li>
        ))}
        {hasNextPage && (
          <li>
            <button
              onClick={() => handlePageClick(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 ${
                currentPage === totalPages ? 'cursor-not-allowed' : ''
              }`}
            >
              Следующая
            </button>
          </li>
        )}
        <li className="ml-4">
          <input
            min={1}
            type="number"
            value={inputPage}
            onChange={handleInputChange}
            placeholder="Перейти к..."
            className="px-3 py-2 w-[8rem] leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg focus:outline-none focus:border-blue-500"
          />
        </li>
        <li>
          <button
            onClick={handleGoToPage}
            className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700"
          >
            Перейти
          </button>
        </li>

        <li className="ml-4">
          <select
            value={pageSize}
            onChange={handlePageSizeChange}
            className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          >
            {pageSizes.map((size, index) => (
              <option key={index} value={size}>
                {size}
              </option>
            ))}
          </select>
        </li>
      </ul>
    </nav>
  );
};
