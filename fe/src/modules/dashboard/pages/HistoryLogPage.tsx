import { useState, useEffect } from 'react';
import { ChangeLogList, ReachChangeLogEntry } from '../components/ChangeLogList.tsx';
import { DashboardPageBaseTemplate } from '../components/DashboardPageBaseTemplate.tsx';
import { Pagination } from '../../../components/Pagination.tsx';
import { PAGE_SIZE_DEFAULT } from '../../../constants/common.ts';
import { SystemLogsServiceApi } from '../../../api/SystemLogsServiceApi.ts';

const HistoryLogPage = () => {
  const [changeLog, setChangeLog] = useState<ReachChangeLogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [exportLoading, setExportLoading] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

  // Состояния для пагинации
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE_DEFAULT);
  const [totalPages, setTotalPages] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);

  const loadLogs = async (page: number = 1, limit: number = PAGE_SIZE_DEFAULT) => {
    try {
      setIsLoading(true);
      setError(null);

      const {
        totalPages,
        hasNext,
        hasPrevious,
        items,
      } = await SystemLogsServiceApi.getAllLogs({ page, limit });

      setTotalPages(totalPages);
      setHasNextPage(hasNext);
      setHasPreviousPage(hasPrevious);

      setChangeLog(items);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось загрузить историю изменений');
      console.error('Error loading system logs:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      setExportLoading(true);
      setExportError(null);

      const blob = await SystemLogsServiceApi.exportLogs({
        limit: 1000, // Максимальный лимит для экспорта
        page: currentPage,
      });

      // Создаем ссылку для скачивания
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `system-logs-export-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

    } catch (err) {
      setExportError(err instanceof Error ? err.message : 'Не удалось экспортировать историю');
      console.error('Error exporting system logs:', err);
    } finally {
      setExportLoading(false);
    }
  };

  useEffect(() => {
    loadLogs(currentPage, pageSize);
  }, [currentPage, pageSize]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  if (isLoading) {
    return (
      <DashboardPageBaseTemplate title="История изменений в системе">
        <div className="bg-white shadow rounded-lg overflow-hidden p-6">
          <div className="text-center">Загрузка истории изменений...</div>
        </div>
      </DashboardPageBaseTemplate>
    );
  }

  if (error) {
    return (
      <DashboardPageBaseTemplate title="История изменений в системе">
        <div className="bg-white shadow rounded-lg overflow-hidden p-6">
          <div className="text-center text-red-600">Ошибка: {error}</div>
          <button
            onClick={() => loadLogs(currentPage, pageSize)}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            Попробовать снова
          </button>
        </div>
      </DashboardPageBaseTemplate>
    );
  }

  return (
    <DashboardPageBaseTemplate title="История изменений в системе">
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <ChangeLogList changeLog={changeLog} />

        {/* Пагинация */}
        {totalPages > 1 && (
          <div className="bg-gray-50 px-6 py-3">
            {/* TODO: #122 Реализация бесконечного скролла на HistoryLogPage */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              hasNextPage={hasNextPage}
              hasPreviousPage={hasPreviousPage}
              onPageSizeChange={handlePageSizeChange}
              pageSize={pageSize}
            />
          </div>
        )}

        {/* Экспорт истории */}
        <div className="bg-gray-50 px-6 py-3 text-right space-y-2">
          {exportError && (
            <div className="text-sm text-red-600 mb-2">
              Ошибка экспорта: {exportError}
            </div>
          )}
          <button
            type="button"
            onClick={handleExport}
            disabled={exportLoading || changeLog.length === 0}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {exportLoading ? 'Экспорт...' : 'Экспорт истории'}
          </button>
        </div>
      </div>
    </DashboardPageBaseTemplate>
  );
};

HistoryLogPage.displayName = 'HistoryLogPage';

export default HistoryLogPage;
