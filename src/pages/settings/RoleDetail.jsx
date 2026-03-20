import React, { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { useParams, useNavigate } from 'react-router-dom';
import { getRole, getRolePermissions, assignRolePermission, removeRolePermission } from '../../services/roles';
import { getGroupedPermissions } from '../../services/permissions';
import PermissionGuard from '../../components/PermissionGuard';
import { ArrowLeft } from 'lucide-react';

export default function RoleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [role, setRole] = useState(null);
  const [groupedParams, setGroupedParams] = useState({});
  const [activePerms, setActivePerms] = useState(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [roleRes, rPermRes, groupRes] = await Promise.all([
        getRole(id),
        getRolePermissions(id),
        getGroupedPermissions()
      ]);
      setRole(roleRes.data || {});
      const activeIds = (rPermRes.data || []).map(p => p.id);
      setActivePerms(new Set(activeIds));
      setGroupedParams(groupRes.data || {});
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const togglePermission = async (permId) => {
    try {
      if (activePerms.has(permId)) {
        await removeRolePermission(id, permId);
        setActivePerms(prev => {
          const next = new Set(prev);
          next.delete(permId);
          return next;
        });
        toast.success(`Permission revoked`);
      } else {
        await assignRolePermission(id, permId);
        setActivePerms(prev => new Set([...prev, permId]));
        toast.success(`Permission assigned`);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to toggle permission');
    }
  };

  if (isLoading) return <div className="p-8 text-center animate-pulse text-gray-400">Loading Role Matrix...</div>;
  if (error) return <div className="p-8 text-red-500 bg-red-50 rounded-lg">{error}</div>;

  return (
    <div className="flex flex-col h-full space-y-6 animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
      <div className="flex items-center gap-4 border-b border-gray-200 dark:border-gray-800 pb-4">
        <button onClick={() => navigate('/roles')} className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
          <ArrowLeft size={18} className="text-gray-600 dark:text-gray-300" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white capitalize tracking-wide">{role?.name} Permissions</h1>
          <p className="text-sm text-gray-500">{role?.description || 'Grant or revoke capabilities strictly'}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 pb-6 space-y-6">
        {Object.entries(groupedParams).map(([groupName, perms]) => (
          <div key={groupName} className="bg-white dark:bg-[#1a1b1e] rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
             <div className="bg-gray-50 dark:bg-surface p-4 font-semibold text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-800 uppercase tracking-widest text-xs">
                {groupName} Capabilities 
             </div>
             <div className="divide-y divide-gray-100 dark:divide-gray-800/60 p-2">
                {perms.map(p => {
                   const isActive = activePerms.has(p.id);
                   return (
                     <label key={p.id} className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-[#2a2b30] rounded-lg cursor-pointer transition-colors group">
                       <div className="flex flex-col">
                         <span className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 select-none">
                           {p.name} 
                         </span>
                         <span className="text-xs text-gray-500 select-none mt-0.5">{p.description}</span>
                       </div>
                       <div className="relative inline-flex items-center cursor-pointer ml-4 shrink-0">
                         <input type="checkbox" className="sr-only peer" checked={isActive} onChange={() => togglePermission(p.id)} />
                         <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
                       </div>
                     </label>
                   )
                })}
             </div>
          </div>
        ))}
        {Object.keys(groupedParams).length === 0 && (
          <div className="text-center p-8 text-gray-500">No capabilities mapped to matrix.</div>
        )}
      </div>
    </div>
  );
}
