import React, { useState, useEffect } from 'react';
import { Shield, Lock, Search, Filter } from 'lucide-react';
import permissionService from '../../services/permissionService';
import Spinner from '../../components/atoms/Spinner';

export default function Permissions() {
  const [groupedPermissions, setGroupedPermissions] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchGroupedPermissions();
  }, []);

  const fetchGroupedPermissions = async () => {
    setIsLoading(true);
    try {
      const res = await permissionService.getGroupedPermissions();
      setGroupedPermissions(res.data || {});
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch permissions');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredGroups = Object.entries(groupedPermissions).reduce((acc, [group, perms]) => {
    const matchedPerms = perms.filter(p => 
      p.toLowerCase().includes(searchTerm.toLowerCase()) || 
      group.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (matchedPerms.length > 0) {
      acc[group] = matchedPerms;
    }
    return acc;
  }, {});

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="anim-fade-up flex flex-col h-full p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight flex items-center gap-2">
            <Lock className="text-indigo-600 dark:text-indigo-400" size={24} />
            Permission Registry
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            System-wide permissions grouped by functional modules.
          </p>
        </div>

        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={16} className="text-zinc-500" />
          </div>
          <input
            type="text"
            placeholder="Search permissions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-64 pl-10 pr-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:border-indigo-500/50 transition-all shadow-sm"
          />
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 mb-6">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(filteredGroups).map(([group, perms]) => (
          <div key={group} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/60 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all">
            <div className="px-5 py-4 border-b border-zinc-100 dark:border-zinc-800/60 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-800/20">
              <h3 className="font-bold text-zinc-900 dark:text-white capitalize flex items-center gap-2">
                <Shield size={16} className="text-indigo-500" />
                {group}
              </h3>
              <span className="text-[10px] font-bold bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded-full">
                {perms.length}
              </span>
            </div>
            <div className="p-4">
              <div className="flex flex-col gap-2">
                {perms.map((perm) => (
                  <div key={perm} className="flex items-center gap-3 group">
                    <div className="w-1.5 h-1.5 rounded-full bg-zinc-300 dark:bg-zinc-700 group-hover:bg-indigo-500 transition-colors" />
                    <code className="text-xs font-mono text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">
                      {perm}
                    </code>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}

        {Object.keys(filteredGroups).length === 0 && (
          <div className="col-span-full py-12 text-center text-zinc-500 bg-white dark:bg-zinc-900 rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800">
            No permissions found matching your search.
          </div>
        )}
      </div>
    </div>
  );
}
