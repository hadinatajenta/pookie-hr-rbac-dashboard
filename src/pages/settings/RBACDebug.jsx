import React, { useState, useEffect } from 'react';
import { userService } from '../../services/userService';
import roleService from '../../services/roleService';
import { Search, Shield, Lock, ChevronRight, User, Info, AlertCircle, Database } from 'lucide-react';
import Spinner from '../../components/atoms/Spinner';
import Badge from '../../components/atoms/Badge';

export default function RBACDebug() {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [debugData, setDebugData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (searchTerm.length > 1) {
      searchUsers();
    } else {
      setUsers([]);
    }
  }, [searchTerm]);

  const searchUsers = async () => {
    setIsSearching(true);
    try {
      const res = await userService.getUsers();
      // Filter locally for the debug search
      const filtered = (res.data || []).filter(u => 
        u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.first_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setUsers(filtered);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectUser = async (user) => {
    setSelectedUser(user);
    setSearchTerm('');
    setUsers([]);
    setIsLoading(true);
    try {
      const res = await roleService.debugUser(user.id);
      setDebugData(res.data);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to fetch debug data');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="anim-fade-up flex flex-col h-full p-6 space-y-6">
      <div className="shrink-0">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight flex items-center gap-2">
          <Database className="text-indigo-600 dark:text-indigo-400" size={24} />
          RBAC Debugger
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          Inspect role resolution, inheritance depth, and effective permission sets for any user.
        </p>
      </div>

      <div className="relative z-50">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={18} className="text-zinc-500" />
        </div>
        <input
          type="text"
          placeholder="Search for a user to inspect..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-900 dark:text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500/50 shadow-sm"
        />
        
        {users.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xl overflow-hidden max-h-60 overflow-y-auto">
            {users.map(u => (
              <button 
                key={u.id} 
                onClick={() => handleSelectUser(u)}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors text-left border-b border-zinc-100 dark:border-zinc-800/40 last:border-0"
              >
                <div className="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center text-xs font-bold text-indigo-500">{u.first_name[0]}</div>
                <div>
                  <p className="text-sm font-medium text-zinc-900 dark:text-white">{u.first_name} {u.last_name}</p>
                  <p className="text-[11px] text-zinc-500 font-mono">@{u.username}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex-1 overflow-hidden">
        {isLoading ? (
          <div className="h-full flex items-center justify-center"><Spinner size="lg" /></div>
        ) : debugData ? (
          <div className="h-full flex flex-col lg:flex-row gap-6 overflow-hidden">
            {/* User Profile Card */}
            <div className="lg:w-80 flex flex-col gap-6 shrink-0">
               <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/60 rounded-2xl p-6 shadow-sm">
                  <div className="flex flex-col items-center text-center mb-6">
                    <div className="w-16 h-16 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-2xl font-bold text-zinc-400 mb-3 border-2 border-zinc-200 dark:border-zinc-700">
                       {selectedUser?.first_name[0]}
                    </div>
                    <h3 className="font-bold text-zinc-900 dark:text-white">{selectedUser?.first_name} {selectedUser?.last_name}</h3>
                    <p className="text-xs text-zinc-500 font-mono">ID: {selectedUser?.id}</p>
                  </div>
                  
                  <div className="space-y-4">
                     <div className="flex justify-between items-center text-xs">
                        <span className="text-zinc-500">Direct Roles</span>
                        <span className="font-bold text-zinc-900 dark:text-white">{debugData.user_roles?.length || 0}</span>
                     </div>
                     <div className="flex justify-between items-center text-xs">
                        <span className="text-zinc-500">Inherited Roles</span>
                        <span className="font-bold text-zinc-900 dark:text-white">{debugData.inherited_roles?.length || 0}</span>
                     </div>
                     <div className="flex justify-between items-center text-xs">
                        <span className="text-zinc-500">Total Permissions</span>
                        <span className="font-bold text-indigo-600 dark:text-indigo-400">{debugData.permissions?.length || 0}</span>
                     </div>
                  </div>
               </div>

               <div className="bg-amber-500/5 border border-amber-500/20 p-4 rounded-xl">
                  <div className="flex gap-2 mb-2 text-amber-600 dark:text-amber-400">
                    <Info size={16} />
                    <span className="text-xs font-bold uppercase tracking-wider">Note</span>
                  </div>
                  <p className="text-[11px] text-amber-600/80 leading-relaxed italic">
                    Effective permissions are calculated across the entire role hierarchy including recursive inheritance.
                  </p>
               </div>
            </div>

            {/* Resolution Visualizer */}
            <div className="flex-1 space-y-6 overflow-y-auto pb-6">
               <div className="space-y-4">
                  <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest px-1 flex items-center gap-2">
                    <Shield size={16} /> Role Resolution
                  </h3>
                  
                  <div className="flex flex-col gap-3">
                     {debugData.user_roles?.map(role => (
                       <div key={role} className="flex items-center gap-3">
                          <div className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold shadow-md shadow-indigo-500/20">
                             {role}
                          </div>
                          {debugData.inherited_roles?.length > 0 && (
                            <ChevronRight size={16} className="text-zinc-400" />
                          )}
                          <div className="flex flex-wrap gap-2">
                             {debugData.inherited_roles?.map(ir => (
                               <div key={ir} className="px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs font-medium text-zinc-600 dark:text-zinc-300">
                                  {ir}
                               </div>
                             ))}
                          </div>
                       </div>
                     ))}
                  </div>
               </div>

               <div className="space-y-4">
                  <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest px-1 flex items-center gap-2">
                    <Lock size={16} /> Effective Permission Set
                  </h3>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                     {debugData.permissions?.sort().map(p => (
                       <div key={p} className="px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-[10px] font-mono text-zinc-600 dark:text-zinc-400 hover:border-indigo-500/50 hover:text-indigo-500 transition-all text-center truncate" title={p}>
                          {p}
                       </div>
                     ))}
                  </div>
               </div>
            </div>
          </div>
        ) : (
          <div className="h-full border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl flex flex-col items-center justify-center text-zinc-400 p-12 text-center">
             <AlertCircle size={48} className="mb-4 opacity-20" />
             <p className="text-lg font-medium">No User Selected</p>
             <p className="text-sm max-w-xs mt-2">Use the search bar above to select a user and inspect their RBAC data.</p>
          </div>
        )}
      </div>
    </div>
  );
}
