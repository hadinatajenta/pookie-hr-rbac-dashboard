import React, { useEffect, useState } from 'react';
import { userService } from '../../services/userService';
import roleService from '../../services/roleService';
import Spinner from '../../components/atoms/Spinner';
import { Users, Search, MoreHorizontal, Shield, Lock, X, Plus, Trash2, Check } from 'lucide-react';
import Badge from '../../components/atoms/Badge';

export default function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  // RBAC State
  const [selectedUser, setSelectedUser] = useState(null);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [isPermModalOpen, setIsPermModalOpen] = useState(false);
  const [allRoles, setAllRoles] = useState([]);
  const [userRoles, setUserRoles] = useState([]);
  const [userPerms, setUserPerms] = useState([]);
  const [isActionLoading, setIsActionLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const res = await userService.getUsers();
      setEmployees(res.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch employees');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const res = await roleService.getRoles();
      setAllRoles(res.data || []);
    } catch (err) {
      console.error('Failed to fetch roles:', err);
    }
  };

  const handleManageRoles = async (user) => {
    setSelectedUser(user);
    setIsActionLoading(true);
    setIsRoleModalOpen(true);
    try {
      const res = await userService.getUserRoles(user.id);
      setUserRoles(res.data || []);
    } catch (err) {
      alert('Failed to fetch user roles');
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleViewPermissions = async (user) => {
    setSelectedUser(user);
    setIsActionLoading(true);
    setIsPermModalOpen(true);
    try {
      const res = await userService.getUserPermissions(user.id);
      setUserPerms(res.data || []);
    } catch (err) {
      alert('Failed to fetch user permissions');
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleAssignRole = async (roleId) => {
    try {
      await userService.assignRole(selectedUser.id, roleId);
      const res = await userService.getUserRoles(selectedUser.id);
      setUserRoles(res.data || []);
      fetchUsers(); // Refresh main list to show new badges
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to assign role');
    }
  };

  const handleRemoveRole = async (roleId) => {
    try {
      await userService.removeRole(selectedUser.id, roleId);
      setUserRoles(userRoles.filter(r => r.id !== roleId));
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to remove role');
    }
  };

  const hasRole = (roleId) => userRoles.some(r => r.id === roleId);

  const filteredEmployees = employees.filter(emp => {
    const term = searchTerm.toLowerCase();
    return (
      emp.first_name?.toLowerCase().includes(term) ||
      emp.last_name?.toLowerCase().includes(term) ||
      emp.email?.toLowerCase().includes(term) ||
      emp.username?.toLowerCase().includes(term)
    );
  });

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="anim-fade-up flex flex-col h-full overflow-hidden">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 sm:mb-8 shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight flex items-center gap-2">
            <Users className="text-indigo-600 dark:text-indigo-400" size={24} />
            Employee Directory
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Manage and view all registered users across the organization.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1 sm:flex-none">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={16} className="text-zinc-500" />
            </div>
            <input
              type="text"
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-64 pl-10 pr-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:border-indigo-500/50 transition-all shadow-sm"
            />
          </div>
          <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-colors shadow-sm whitespace-nowrap">
            Add User
          </button>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/60 rounded-xl overflow-hidden flex-1 flex flex-col relative z-10 shadow-sm dark:shadow-xl">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-zinc-50 dark:bg-zinc-900/50 border-b border-zinc-200 dark:border-zinc-800/60 text-zinc-500 dark:text-zinc-400 uppercase tracking-wider text-xs sticky top-0 z-10">
              <tr>
                <th className="px-6 py-4 font-semibold">User</th>
                <th className="px-6 py-4 font-semibold">Username</th>
                <th className="px-6 py-4 font-semibold">Roles</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800/40 text-zinc-600 dark:text-zinc-300">
              {filteredEmployees.map((emp) => (
                <tr key={emp.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/20 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-xs font-bold text-zinc-700 dark:text-zinc-300">
                        {emp.first_name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium text-zinc-900 dark:text-white">{emp.first_name} {emp.last_name}</span>
                        <span className="text-[11px] text-zinc-500">{emp.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono text-xs text-zinc-500">@{emp.username}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1.5">
                      {emp.roles?.map((role, idx) => (
                        <Badge key={idx} variant="default" className="text-[10px] px-1.5 py-0.5">{role}</Badge>
                      )) || <span className="text-xs text-zinc-400 italic">No roles</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleViewPermissions(emp)}
                        className="p-1.5 rounded-lg text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-indigo-600 dark:hover:text-indigo-400"
                        title="View Permissions"
                      >
                        <Lock size={16} />
                      </button>
                      <button 
                        onClick={() => handleManageRoles(emp)}
                        className="p-1.5 rounded-lg text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-indigo-600 dark:hover:text-indigo-400"
                        title="Manage Roles"
                      >
                        <Shield size={16} />
                      </button>
                      <button className="p-1.5 rounded-lg text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white">
                        <MoreHorizontal size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Role Management Modal */}
      {isRoleModalOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm anim-fade-in">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl w-full max-w-md shadow-2xl anim-fade-up overflow-hidden">
            <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-800/30">
              <h3 className="font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                <Shield size={18} className="text-indigo-500" />
                Manage Roles: {selectedUser?.first_name}
              </h3>
              <button onClick={() => setIsRoleModalOpen(false)} className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white"><X size={20} /></button>
            </div>
            
            <div className="p-6 max-h-[60vh] overflow-y-auto">
              {isActionLoading ? (
                <div className="flex justify-center py-12"><Spinner /></div>
              ) : (
                <div className="space-y-3">
                  {allRoles.map(role => {
                    const assigned = hasRole(role.id);
                    return (
                      <div key={role.id} className={`flex items-center justify-between p-3 rounded-xl border transition-all ${assigned ? 'bg-indigo-50/50 dark:bg-indigo-500/5 border-indigo-200 dark:border-indigo-500/30' : 'bg-white dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800'}`}>
                        <div>
                          <p className="text-sm font-bold text-zinc-900 dark:text-white">{role.name}</p>
                          <p className="text-[11px] text-zinc-500 line-clamp-1">{role.description}</p>
                        </div>
                        {assigned ? (
                          <button onClick={() => handleRemoveRole(role.id)} className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"><Trash2 size={16} /></button>
                        ) : (
                          <button onClick={() => handleAssignRole(role.id)} className="p-1.5 text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-lg transition-colors"><Plus size={16} /></button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Effective Permissions Modal */}
      {isPermModalOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm anim-fade-in">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl w-full max-w-lg shadow-2xl anim-fade-up overflow-hidden">
            <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-800/30">
              <h3 className="font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                <Lock size={18} className="text-indigo-500" />
                Effective Permissions: {selectedUser?.first_name}
              </h3>
              <button onClick={() => setIsPermModalOpen(false)} className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white"><X size={20} /></button>
            </div>
            
            <div className="p-6 max-h-[60vh] overflow-y-auto">
              {isActionLoading ? (
                <div className="flex justify-center py-12"><Spinner /></div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {userPerms.length > 0 ? userPerms.map((perm, idx) => (
                    <div key={idx} className="flex items-center gap-2 px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg">
                      <Check size={12} className="text-green-500" />
                      <code className="text-[11px] font-mono text-zinc-700 dark:text-zinc-300">{perm}</code>
                    </div>
                  )) : (
                    <p className="w-full text-center py-8 text-zinc-500 italic">No permissions assigned.</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
