import React, { useState, useEffect } from 'react';
import { Search, Filter, History, ChevronRight, ChevronDown, User, Activity, Clock } from 'lucide-react';
import auditService from '../../services/auditService';

export default function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [limit] = useState(10);
  const [filters, setFilters] = useState({ user_id: '', action: '' });
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    loadLogs();
  }, [page, filters]);

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
          <div className="bg-surface p-3 rounded-lg border border-border">
            <h4 className="text-xs font-semibold text-text-secondary uppercase mb-2">Old Data</h4>
            <pre className="text-xs overflow-x-auto text-text-primary whitespace-pre-wrap">
              {oldObj ? JSON.stringify(oldObj, null, 2) : 'N/A'}
            </pre>
          </div>
          <div className="bg-surface p-3 rounded-lg border border-border">
            <h4 className="text-xs font-semibold text-text-secondary uppercase mb-2">New Data</h4>
            <pre className="text-xs overflow-x-auto text-text-primary whitespace-pre-wrap">
              {newObj ? JSON.stringify(newObj, null, 2) : 'N/A'}
            </pre>
          </div>
        </div>
      );
    } catch (e) {
      return <div>Raw data: {newData || oldData}</div>;
    }
  };

  return (
    <div className="p-6 space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">System Audit Logs</h1>
          <p className="text-text-secondary">Track activity and changes across the platform</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-accent/10 rounded-full border border-accent/20">
          <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          <span className="text-xs font-medium text-accent">Live Monitoring Active</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-2 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
          <input
            type="text"
            placeholder="Filter by User ID..."
            className="w-full pl-10 pr-4 py-2 bg-surface border border-border rounded-xl text-text-primary focus:border-accent transition-colors outline-none"
            onChange={(e) => setFilters({ ...filters, user_id: e.target.value })}
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
          <select
            className="w-full pl-10 pr-4 py-2 bg-surface border border-border rounded-xl text-text-primary appearance-none focus:border-accent transition-colors outline-none"
            onChange={(e) => setFilters({ ...filters, action: e.target.value })}
          >
            <option value="">All Actions</option>
            <option value="CREATE">Create</option>
            <option value="UPDATE">Update</option>
            <option value="DELETE">Delete</option>
            <option value="LOGIN">Login</option>
          </select>
        </div>
        <button 
          onClick={loadLogs}
          className="px-4 py-2 bg-accent text-white rounded-xl font-medium hover:bg-accent-hover transition-colors shadow-lg shadow-accent/20"
        >
          Refresh Logs
        </button>
      </div>

      <div className="bg-surface rounded-2xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border bg-background/50">
                <th className="px-6 py-4 text-xs font-bold text-text-secondary uppercase">Activity</th>
                <th className="px-6 py-4 text-xs font-bold text-text-secondary uppercase">Actor</th>
                <th className="px-6 py-4 text-xs font-bold text-text-secondary uppercase">Target</th>
                <th className="px-6 py-4 text-xs font-bold text-text-secondary uppercase">Context</th>
                <th className="px-6 py-4 text-xs font-bold text-text-secondary uppercase">Timestamp</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                Array(5).fill(0).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan="6" className="px-6 py-4 h-16">
                      <div className="h-4 bg-border rounded-full w-full" />
                    </td>
                  </tr>
                ))
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-text-secondary">
                    No activity logs found matching your filters.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <React.Fragment key={log.id}>
                    <tr className="hover:bg-background/30 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${
                            log.action === 'CREATE' ? 'bg-green-500/10 text-green-500' :
                            log.action === 'UPDATE' ? 'bg-blue-500/10 text-blue-500' :
                            log.action === 'DELETE' ? 'bg-red-500/10 text-red-500' :
                            'bg-accent/10 text-accent'
                          }`}>
                            <History className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-text-primary">{log.action}</p>
                            <p className="text-xs text-text-secondary">Action performed</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-text-secondary" />
                          <span className="text-sm text-text-primary font-medium">User #{log.user_id}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <span className="text-xs px-2 py-0.5 bg-surface border border-border rounded text-text-secondary">
                            {log.entity}
                          </span>
                          <p className="text-sm text-text-primary font-medium">ID: {log.entity_id}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <p className="text-xs font-mono text-text-secondary truncate max-w-[150px]">
                            {log.method} {log.path}
                          </p>
                          <p className="text-[10px] text-text-secondary">{log.ip_address}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-text-secondary">
                          <Clock className="w-4 h-4" />
                          <span className="text-sm">{new Date(log.created_at).toLocaleString()}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => toggleExpand(log.id)}
                          className="p-2 hover:bg-surface rounded-lg transition-colors text-text-secondary"
                        >
                          {expandedId === log.id ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                        </button>
                      </td>
                    </tr>
                    {expandedId === log.id && (
                      <tr>
                        <td colSpan="6" className="px-6 py-4 bg-background/50 border-y border-border">
                          <div className="animate-in slide-in-from-top-2 duration-300">
                            <div className="flex items-center gap-2 mb-4">
                              <Activity className="w-4 h-4 text-accent" />
                              <h3 className="text-sm font-bold text-text-primary">Data Change Context</h3>
                              <span className="text-xs text-text-secondary font-mono ml-auto">Trace: {log.request_id}</span>
                            </div>
                            <div className="text-xs text-text-secondary mb-4 italic">
                              Browser Agent: {log.user_agent}
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
        
        <div className="px-6 py-4 border-t border-border flex justify-between items-center bg-background/50">
          <p className="text-sm text-text-secondary">
            Showing <span className="font-medium text-text-primary">{logs.length}</span> of <span className="font-medium text-text-primary">{total}</span> total entries
          </p>
          <div className="flex gap-2">
            <button 
              disabled={page === 0}
              onClick={() => setPage(page - 1)}
              className="px-4 py-2 border border-border rounded-xl text-sm font-medium enabled:hover:bg-surface disabled:opacity-50 transition-colors"
            >
              Previous
            </button>
            <button 
              disabled={(page + 1) * limit >= total}
              onClick={() => setPage(page + 1)}
              className="px-4 py-2 border border-border rounded-xl text-sm font-medium enabled:hover:bg-surface disabled:opacity-50 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
