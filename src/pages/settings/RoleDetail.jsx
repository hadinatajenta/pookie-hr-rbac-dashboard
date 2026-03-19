import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Shield, ChevronLeft, Lock, Users, Plus, Trash2, Check, Search } from 'lucide-react';
import roleService from '../../services/roleService';
import permissionService from '../../services/permissionService';
import Spinner from '../../components/atoms/Spinner';
import Badge from '../../components/atoms/Badge';

export default function RoleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [role, setRole] = useState(null);
  const [rolePermissions, setRolePermissions] = useState([]);
  const [allPermissions, setAllPermissions] = useState([]);
  const [roleUsers, setRoleUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('permissions');

  useEffect(() => {
    fetchRoleData();
  }, [id]);

  const fetchRoleData = async () => {
    setIsLoading(true);
    try {
      const [roleRes, permsRes, allPermsRes, usersRes] = await Promise.all([
        roleService.getRole(id),
        roleService.getRolePermissions(id),
        permissionService.getPermissions(),
        roleService.getRoleUsers(id)
      ]);
      setRole(roleRes.data);
      setRolePermissions(permsRes.data || []);
      setAllPermissions(allPermsRes.data || []);
      setRoleUsers(usersRes.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch role details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAssignPermission = async (permissionId) => {
    try {
      await roleService.assignPermission(id, permissionId);
      const updatedPerms = await roleService.getRolePermissions(id);
      setRolePermissions(updatedPerms.data || []);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to assign permission');
    }
  };

  const handleRemovePermission = async (permissionId) => {
    try {
      await roleService.removePermission(id, permissionId);
      setRolePermissions(rolePermissions.filter(p => p.id !== permissionId));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to remove permission');
    }
  };

  const isAssigned = (permissionId) => rolePermissions.some(p => p.id === permissionId);

  const filteredPermissions = allPermissions.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) return <div className="flex h-full items-center justify-center"><Spinner size="lg" /></div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="anim-fade-up flex flex-col h-full p-6">
      {/* Header */}
      <div className="mb-8">
        <button 
          onClick={() => navigate('/settings/roles')}
          className="flex items-center gap-1.5 text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors mb-4 text-sm font-medium"
        >
          <ChevronLeft size={16} />
          Back to Roles
        </button>
        
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-600 rounded-2xl text-white shadow-lg shadow-indigo-500/20">
              <Shield size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">{role?.name}</h1>
              <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-0.5">{role?.description}</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Badge variant="default" className="bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
              ID: {id}
            </Badge>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-zinc-200 dark:border-zinc-800 mb-6">
        <button 
          onClick={() => setActiveTab('permissions')}
          className={`px-6 py-3 text-sm font-medium transition-all relative ${
            activeTab === 'permissions' 
              ? 'text-indigo-600 dark:text-indigo-400' 
              : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300'
          }`}
        >
          <div className="flex items-center gap-2">
             <Lock size={16} /> Permissions
             <span className="bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-[10px]">{rolePermissions.length}</span>
          </div>
          {activeTab === 'permissions' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 dark:bg-indigo-400 rounded-full" />}
        </button>
        <button 
          onClick={() => setActiveTab('users')}
          className={`px-6 py-3 text-sm font-medium transition-all relative ${
            activeTab === 'users' 
              ? 'text-indigo-600 dark:text-indigo-400' 
              : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300'
          }`}
        >
          <div className="flex items-center gap-2">
             <Users size={16} /> Assigned Users
             <span className="bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-[10px]">{roleUsers.length}</span>
          </div>
          {activeTab === 'users' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 dark:bg-indigo-400 rounded-full" />}
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {activeTab === 'permissions' ? (
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between mb-4">
              <div className="relative flex-1 max-w-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={16} className="text-zinc-500" />
                </div>
                <input
                  type="text"
                  placeholder="Filter available permissions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500/50"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto pb-6">
              {filteredPermissions.map((perm) => {
                const isAssignedToRole = isAssigned(perm.id);
                return (
                  <div 
                    key={perm.id} 
                    className={`p-4 rounded-xl border transition-all flex items-start justify-between group h-fit ${
                      isAssignedToRole 
                        ? 'bg-indigo-50/50 dark:bg-indigo-500/5 border-indigo-200 dark:border-indigo-500/20' 
                        : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'
                    }`}
                  >
                    <div>
                      <h4 className={`text-sm font-bold mb-1 ${isAssignedToRole ? 'text-indigo-700 dark:text-indigo-400' : 'text-zinc-900 dark:text-white'}`}>
                        {perm.name}
                      </h4>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                        {perm.description || 'No description provided.'}
                      </p>
                    </div>
                    {isAssignedToRole ? (
                      <button 
                        onClick={() => handleRemovePermission(perm.id)}
                        className="p-1.5 rounded-lg bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 hover:bg-red-100 dark:hover:bg-red-500/20 hover:text-red-600 dark:hover:text-red-400 transition-all shadow-sm"
                        title="Remove Permission"
                      >
                        <Check size={16} className="group-hover:hidden" />
                        <Trash2 size={16} className="hidden group-hover:block" />
                      </button>
                    ) : (
                      <button 
                        onClick={() => handleAssignPermission(perm.id)}
                        className="p-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-500 hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                        title="Assign Permission"
                      >
                        <Plus size={16} />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/60 rounded-xl overflow-hidden shadow-sm">
             <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-zinc-50 dark:bg-zinc-900/50 border-b border-zinc-200 dark:border-zinc-800/60 text-zinc-500 dark:text-zinc-400 uppercase tracking-wider text-xs">
                  <tr>
                    <th className="px-6 py-4 font-semibold">User</th>
                    <th className="px-6 py-4 font-semibold">Username</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800/40 text-zinc-600 dark:text-zinc-300">
                  {roleUsers.length > 0 ? (
                    roleUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/20 transition-colors">
                        <td className="px-6 py-4 font-medium text-zinc-900 dark:text-white">
                          {user.first_name} {user.last_name}
                        </td>
                        <td className="px-6 py-4 font-mono text-xs text-zinc-500">
                          @{user.username}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                            <span className="text-[11px] font-bold text-green-600 dark:text-green-500 uppercase tracking-wider">Active</span>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="px-6 py-12 text-center text-zinc-500 italic">
                        No users currently assigned to this role.
                      </td>
                    </tr>
                  )}
                </tbody>
             </table>
          </div>
        )}
      </div>
    </div>
  );
}
