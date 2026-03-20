import React, { useState, useEffect, useCallback } from 'react';
import { getAuditLogs } from '../../services/auditLogs';
import DataTable from '../../components/DataTable';
import { ShieldAlert, Search } from 'lucide-react';

export default function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Pagination & Filters State
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [total, setTotal] = useState(0);
  
  // Filter Fields
  const [userIdFilter, setUserIdFilter] = useState('');
  const [actionFilter, setActionFilter] = useState('');
  const [resourceFilter, setResourceFilter] = useState('');

  const fetchLogs = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = {
        page,
        limit,
        user_id: userIdFilter || undefined,
        action: actionFilter || undefined,
        resource: resourceFilter || undefined
      };
      
      const response = await getAuditLogs(params);
      
      setLogs(response.data?.logs || response.data || []);
      setTotal(response.data?.total || response.meta?.total || 0);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, userIdFilter, actionFilter, resourceFilter]);

  // Refetch when filters/pagination changes
  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const handleApplyFilters = (e) => {
    e.preventDefault();
    setPage(1); // Reset to first page
    fetchLogs();
  };

  const columns = [
    { key: 'created_at', title: 'Timestamp', render: row => <span className="font-mono text-xs text-gray-500 dark:text-gray-400">{new Date(row.created_at).toLocaleString()}</span> },
    { key: 'user_id', title: 'Actor ID', render: row => <span className="font-semibold text-indigo-600 dark:text-indigo-400">{row.user_id === 0 ? 'SYSTEM' : `UID:${row.user_id}`}</span> },
    { key: 'action', title: 'Action Vector', render: row => (
        <span className="px-2 py-0.5 rounded text-xs tracking-wider bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 uppercase font-bold">
           {row.action}
        </span>
    )},
    { key: 'resource', title: 'Resource Target' },
    { key: 'details', title: 'Context Trace', render: row => (
        <div className="max-w-[400px] truncate text-xs font-mono text-gray-500 overflow-hidden text-ellipsis" title={row.details}>
          {row.details || '-'}
        </div>
    )},
    { key: 'ip_address', title: 'Origin IP', render: row => <span className="text-xs font-mono">{row.ip_address}</span> }
  ];

  const paginationInfo = {
    page,
    limit,
    total,
    onPageChange: (newPage) => setPage(newPage),
    onLimitChange: (newLimit) => { setLimit(newLimit); setPage(1); }
  };

  return (
    <div className="flex flex-col h-full space-y-4 animate-in fade-in zoom-in-95 duration-200">
      <div className="flex items-center justify-between">
        <div>
           <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
             <ShieldAlert size={24} className="text-amber-500" /> Administrative Audit Graph
           </h1>
           <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Irrevocable historic action traces within the protected API boundary.</p>
        </div>
      </div>
      
      {/* Filters Form */}
      <form onSubmit={handleApplyFilters} className="bg-white dark:bg-[#1a1b1e] p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 flex items-end gap-4">
         <div className="flex-1">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Actor ID</label>
            <input type="number" placeholder="Sys ID" value={userIdFilter} onChange={e => setUserIdFilter(e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-surface text-gray-900 dark:text-gray-100" />
         </div>
         <div className="flex-1">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Action Code</label>
            <input type="text" placeholder="e.g. CREATE" value={actionFilter} onChange={e => setActionFilter(e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-surface text-gray-900 dark:text-gray-100" />
         </div>
         <div className="flex-1">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Resource</label>
            <input type="text" placeholder="e.g. user" value={resourceFilter} onChange={e => setResourceFilter(e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-surface text-gray-900 dark:text-gray-100" />
         </div>
         <button type="submit" className="px-5 py-2 h-[38px] bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-md shadow-sm flex items-center gap-2 transition-colors">
            <Search size={16} /> Filter Forensics
         </button>
      </form>

      {error && <div className="text-sm border border-red-500/20 text-red-500 bg-red-50 dark:bg-red-900/10 p-4 rounded-lg">{error}</div>}

      <div className="flex-1 bg-white dark:bg-[#1a1b1e] rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 relative min-h-[400px]">
        <DataTable columns={columns} data={logs} isLoading={isLoading} emptyState="Empty timeline index." pagination={paginationInfo} />
      </div>
    </div>
  );
}
