import React, { useState, useEffect } from 'react';
import { Search, Filter, History, ChevronRight, ChevronDown, User, Activity, Clock, Calendar } from 'lucide-react';
import auditService from '../../services/auditService';

export default function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [limit] = useState(10);
  const [filters, setFilters] = useState({ 
    user_id: '', 
    action: '',
    entity: '',
    from: '',
    to: ''
  });
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    loadLogs();
  }, [page, filters.action, filters.entity]); // Trigger on simple filter changes

  const loadLogs = async () => {
    setLoading(true);
    try {
      const res = await auditService.getLogs({
        ...filters,
        limit,
        offset: page * limit,
      });
      setLogs(res.data.items || []);
      setTotal(res.data.total);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const renderDataDiff = (oldData, newData) => {
    try {
      const oldObj = oldData ? JSON.parse(oldData) : null;
      const newObj = newData ? JSON.parse(newData) : null;

      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="bg-zinc-50 dark:bg-zinc-950 p-3 rounded-lg border border-zinc-200 dark:border-zinc-800">
            <h4 className="text-xs font-semibold text-zinc-500 uppercase mb-2">Old Data</h4>
            <pre className="text-xs overflow-x-auto text-zinc-900 dark:text-zinc-300 whitespace-pre-wrap font-mono">
              {oldObj ? JSON.stringify(oldObj, null, 2) : 'N/A'}
            </pre>
          </div>
          <div className="bg-zinc-50 dark:bg-zinc-950 p-3 rounded-lg border border-zinc-200 dark:border-zinc-800">
            <h4 className="text-xs font-semibold text-zinc-500 uppercase mb-2">New Data</h4>
            <pre className="text-xs overflow-x-auto text-zinc-900 dark:text-zinc-300 whitespace-pre-wrap font-mono">
              {newObj ? JSON.stringify(newObj, null, 2) : 'N/A'}
            </pre>
          </div>
        </div>
      );
    } catch (e) {
      return <div className="text-xs font-mono text-zinc-500">Raw data: {newData || oldData}</div>;
    }
  };

  return (
    <div className="p-6 pb-20 space-y-6 anim-fade-up">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
            <History className="text-indigo-600 dark:text-indigo-400" />
            System Audit Logs
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">Track activity and state changes across the platform</p>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/60 rounded-2xl p-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              placeholder="User ID"
              className="w-full pl-10 pr-4 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm focus:border-indigo-500 outline-none transition-all"
              value={filters.user_id}
              onChange={(e) => setFilters({ ...filters, user_id: e.target.value })}
            />
          </div>
          
          <div className="relative">
            <Activity className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Entity (e.g. users)"
              className="w-full pl-10 pr-4 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm focus:border-indigo-500 outline-none transition-all"
              value={filters.entity}
              onChange={(e) => setFilters({ ...filters, entity: e.target.value })}
            />
          </div>

          <div className="relative">
             <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
             <input
               type="date"
               className="w-full pl-10 pr-4 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm focus:border-indigo-500 outline-none transition-all"
               value={filters.from}
               onChange={(e) => setFilters({ ...filters, from: e.target.value })}
             />
          </div>

          <div className="relative">
             <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
             <input
               type="date"
               className="w-full pl-10 pr-4 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm focus:border-indigo-500 outline-none transition-all"
               value={filters.to}
               onChange={(e) => setFilters({ ...filters, to: e.target.value })}
             />
          </div>

          <button 
            onClick={loadLogs}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-medium transition-all shadow-lg shadow-indigo-500/20"
          >
            Apply Filters
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/60 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
                <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Activity</th>
                <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Actor</th>
                <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Target</th>
                <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Timestamp</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800/40">
              {loading ? (
                Array(5).fill(0).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan="5" className="px-6 py-4 h-16">
                      <div className="h-4 bg-zinc-100 dark:bg-zinc-800 rounded-full w-full" />
                    </td>
                  </tr>
                ))
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-zinc-500 italic">
                    No activity logs found matching your filters.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <React.Fragment key={log.id}>
                    <tr className="hover:bg-zinc-50 dark:hover:bg-zinc-800/20 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${
                            log.action === 'CREATE' ? 'bg-green-500/10 text-green-500' :
                            log.action === 'UPDATE' ? 'bg-indigo-500/10 text-indigo-500' :
                            log.action === 'DELETE' ? 'bg-red-500/10 text-red-500' :
                            'bg-zinc-500/10 text-zinc-500'
                          }`}>
                            <Activity size={16} />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-tighter">{log.action}</p>
                            <p className="text-[10px] text-zinc-500 font-mono">{log.method}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-[10px] font-bold text-zinc-400">
                             {log.user_id}
                          </div>
                          <span className="text-xs text-zinc-600 dark:text-zinc-400 font-medium">User #{log.user_id}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <span className="text-[10px] px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-zinc-500 uppercase font-bold tracking-tighter">
                            {log.entity}
                          </span>
                          <p className="text-xs text-zinc-900 dark:text-zinc-300 font-medium">ID: {log.entity_id}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-zinc-500">
                          <Clock size={14} />
                          <span className="text-xs font-medium">{new Date(log.created_at).toLocaleString()}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => toggleExpand(log.id)}
                          className={`p-2 rounded-lg transition-all ${expandedId === log.id ? 'bg-indigo-600 text-white' : 'text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'}`}
                        >
                          {expandedId === log.id ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                        </button>
                      </td>
                    </tr>
                    {expandedId === log.id && (
                      <tr className="bg-zinc-50/50 dark:bg-zinc-950/30">
                        <td colSpan="5" className="px-8 py-6 border-y border-zinc-100 dark:border-zinc-800/60">
                          <div className="anim-fade-up">
                            <div className="flex items-center gap-2 mb-4">
                              <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                              <h3 className="text-xs font-bold text-zinc-900 dark:text-white uppercase tracking-widest">State Change Delta</h3>
                              <span className="text-[10px] text-zinc-500 font-mono ml-auto">Request: {log.request_id}</span>
                            </div>
                            <div className="text-[10px] text-zinc-500 mb-6 font-mono p-3 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-lg">
                              {log.user_agent}
                            </div>
                            {renderDataDiff(log.old_data, log.new_data)}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        <div className="px-6 py-4 border-t border-zinc-200 dark:border-zinc-800 flex justify-between items-center bg-zinc-50/30 dark:bg-zinc-900/50">
          <p className="text-xs text-zinc-500">
            Showing <span className="font-bold text-zinc-900 dark:text-white">{logs.length}</span> of <span className="font-bold text-zinc-900 dark:text-white">{total}</span> total entries
          </p>
          <div className="flex gap-2">
            <button 
              disabled={page === 0}
              onClick={() => setPage(page - 1)}
              className="px-4 py-2 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs font-bold uppercase tracking-wider enabled:hover:bg-white dark:enabled:hover:bg-zinc-800 disabled:opacity-30 transition-all"
            >
              Previous
            </button>
            <button 
              disabled={(page + 1) * limit >= total}
              onClick={() => setPage(page + 1)}
              className="px-4 py-2 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs font-bold uppercase tracking-wider enabled:hover:bg-white dark:enabled:hover:bg-zinc-800 disabled:opacity-30 transition-all"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
