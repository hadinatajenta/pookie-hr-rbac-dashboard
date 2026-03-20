import React from 'react';

/**
 * Native lightweight data table
 * @param {Array} columns - { key, title, render (optional), sortable (optional) }
 * @param {Array} data - array of record objects
 * @param {Boolean} isLoading - indicates fetch status
 * @param {Object} pagination - { page, limit, total, onPageChange, onLimitChange }
 * @param {Object} sorting - { field, direction, onSort }
 */
export default function DataTable({ 
  columns, 
  data, 
  isLoading, 
  pagination, 
  sorting, 
  emptyState = 'No records found' 
}) {
  const handleSort = (field) => {
    if (!sorting || !sorting.onSort) return;
    const isAsc = sorting.field === field && sorting.direction === 'asc';
    sorting.onSort(field, isAsc ? 'desc' : 'asc');
  };

  return (
    <div className="bg-white dark:bg-surface rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden flex flex-col h-full animate-in fade-in duration-300">
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 dark:bg-[#1a1b1e] border-b border-gray-200 dark:border-gray-800">
              {columns.map((col, idx) => (
                <th 
                  key={col.key || idx}
                  onClick={() => col.sortable && handleSort(col.key)}
                  className={`p-4 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider ${col.sortable ? 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors select-none' : ''}`}
                >
                  <div className="flex items-center gap-2">
                    {col.title}
                    {col.sortable && sorting?.field === col.key && (
                      <span className="text-gray-400 dark:text-gray-500">
                        {sorting.direction === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {isLoading ? (
              <tr>
                <td colSpan={columns.length} className="p-8 text-center text-gray-500 dark:text-gray-400">
                  <div className="flex justify-center items-center gap-3">
                    <svg className="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Loading details...</span>
                  </div>
                </td>
              </tr>
            ) : data && data.length > 0 ? (
              data.map((row, rowIdx) => (
                <tr key={row.id || rowIdx} className="hover:bg-gray-50 dark:hover:bg-[#2a2b30] transition-colors group">
                  {columns.map((col, colIdx) => (
                    <td key={`${row.id || rowIdx}-${col.key || colIdx}`} className="p-4 text-sm text-gray-800 dark:text-gray-300 whitespace-nowrap">
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="p-8 text-center text-gray-500 dark:text-gray-400">
                  {emptyState}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {pagination && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#1a1b1e] flex items-center justify-between">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Showing <span className="font-medium text-gray-900 dark:text-gray-100">{Math.min((pagination.page - 1) * pagination.limit + 1, pagination.total || 0)}</span> to <span className="font-medium text-gray-900 dark:text-gray-100">{Math.min(pagination.page * pagination.limit, pagination.total || 0)}</span> of <span className="font-medium text-gray-900 dark:text-gray-100">{pagination.total || 0}</span> results
          </div>
          
          <div className="flex items-center gap-2">
            <select
              value={pagination.limit}
              onChange={(e) => pagination.onLimitChange && pagination.onLimitChange(Number(e.target.value))}
              className="px-2 py-1 bg-white dark:bg-surface text-sm text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm outline-none focus:ring-1 focus:ring-blue-500"
            >
              {[10, 25, 50, 100].map(val => (
                <option key={val} value={val}>{val} per page</option>
              ))}
            </select>
            
            <div className="flex items-center gap-1 bg-white dark:bg-surface border border-gray-300 dark:border-gray-700 rounded-md shadow-sm">
              <button
                onClick={() => pagination.onPageChange && pagination.onPageChange(pagination.page - 1)}
                disabled={pagination.page <= 1}
                className="px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#2a2b30] disabled:opacity-50 disabled:cursor-not-allowed transition-colors border-r border-gray-300 dark:border-gray-700"
              >
                Previous
              </button>
              <button
                onClick={() => pagination.onPageChange && pagination.onPageChange(pagination.page + 1)}
                disabled={pagination.page * pagination.limit >= (pagination.total || 0)}
                className="px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#2a2b30] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
